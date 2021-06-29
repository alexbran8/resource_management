import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Button, Row, Col, Container, Card } from "react-bootstrap";
import LevelOfCompetence from "./LevelOfCompetence";
import { useSelector, useDispatch } from 'react-redux';
import { getProjects } from '../redux/actions/projects/getProjects'
import { toggleDisplay } from '../redux/actions/projects/toggleDisplay';
import { Switch, FormControlLabel, TextField } from '@material-ui/core';
import { reviewTask } from "../redux/actions/projects/reviewTask";
import { config } from "../config";;
// import { motion } from "framer-motion"
// import { pageTransitions} from "../data/pageTransitions"
// import { pageVariants } from "../data/pageVariants"

const ProjectList = (props) => {
	const dispatch = useDispatch();
	const [value, setValue] = useState('');
	console.log('gety');
	useEffect( () => {
        axios.get(config.baseURL + '/projects')
            .then(res => {
				var finalResult = [];
				var projectNames = [];
				//find all project names
				for(var i = 0; i < res.data.length; i++){
					var j;
					var isDistinct = false;
					for(j = 0; j < i; j++){
						if(res.data[i].projectName === res.data[j].projectName){
							isDistinct = true;
							break;
						}
					}
					if(!isDistinct){
						projectNames.push(res.data[i].projectName);
					}
				}
				//add all projects with their tasks and calculate the no reviewed tasks
				for(var i = 0; i < projectNames.length; i++){
					var object = { "name" : projectNames[i], "verifiedTasks" : 0, "totalTasks" : 0, tsks: [], display : false, competenceLevel : false, buttonDisabled : true};
					//counter for verifiedTasks
					var vT = 0; 
					for(var k = 0; k < res.data.length; k++){
						if(res.data[k].projectName === projectNames[i]){
							object.tsks.push(res.data[k]);
							if(res.data[k].reviewed === 1){
								vT++;
							}
						}
					}
					object.verifiedTasks = vT;
					object.totalTasks = object.tsks.length;
					finalResult.push(object);
				}
				//console.log(finalResult);
                dispatch(getProjects(finalResult));
            })
            .catch(err =>{
                console.log(err);
            })
	},[]);
	
	const projectsReducer = useSelector(state => state.projectsReducer);
	console.log(projectsReducer);

	return (

		// <motion.div
        // initial="initial"
        // animate="in"
        // exit="out"
        // variants={pageVariants}
        // transition={pageTransitions}
		// >

		<div>
			<TextField variant="outlined" label="Search..." onChange={(event) => setValue(event.target.value)} />
			<hr />
			<Container fluid>
				{
					projectsReducer.projects.filter(project => project.name.includes(value)).map((project, projectIndex) => {
						return (
							<Container fluid>
								<Row>
									<Col>
										<Button variant="primary" disabled={project.buttonDisabled} onClick={() => dispatch(toggleDisplay(projectIndex))}>
											{project.name}
										</Button>
									</Col>
									<Col>
										<p>
											{project.verifiedTasks} of {project.totalTasks}
										</p>
									</Col>
									<Col>
										<LevelOfCompetence projectName={project.name} tasks={project.tsks} key={projectIndex} projectIndex={projectIndex} />
									</Col>
								</Row>
								{
									project.display ?
										project.tsks.map((task, taskIndex) => {
											return (
												<Card>
													<Card.Header as="h5">
														<div>{task.task}</div>
													</Card.Header>
													<Card.Body>
														<Card.Text>{task.tt}</Card.Text>
														<Card.Text>{task.status}</Card.Text>
														<Card.Text>{task.site}</Card.Text>
														<LevelOfCompetence key={taskIndex} taskIndex={taskIndex} projectIndex={projectIndex} taskName={task.task} defaultValueRadioButton={task.levelOfCompetence} />
														<FormControlLabel
															control={<Switch color="primary" checked={task.reviewed} />}
															label="Save for later"
															onChange={(event) => {
																console.log(event);
																dispatch(reviewTask(projectIndex, taskIndex));
															}}
														/>
													</Card.Body>
												</Card>
											);
										}) :
										''
								}
							</Container>
						)
					}
					)
				}
			</Container >
		</div>

		// </motion.div>

	);
};
export default ProjectList;
