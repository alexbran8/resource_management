import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { Table, Container, Row, Col} from 'react-bootstrap'
import { OnEditModal } from './OnEditModal'
import { onDeleteTask } from '../redux/actions/tasks/onDeleteTask'
import { getTasks } from "../redux/actions/tasks/getTasks"
// import { motion } from "framer-motion"
// import { pageTransitions } from "../data/pageTransitions"
// import { pageVariants } from "../data/pageVariants"
import { config } from "../config";
import { Button, Modal, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'


const Tasks = () => {
    const { handleSubmit } = useForm();    
    const dispatch = useDispatch();
    const [modalShow, setModalShow] = useState(false);
    const [taskIndex, setTaskIndex] = useState(null);

    useEffect( () => {
        axios.get( config.baseURL + config.baseLOCATION + '/dailyTasks', {withCredentials: true})
            .then(res =>{
                dispatch(getTasks(res.data));
            })
            .catch(err =>{
                console.log(err);
            })
    },[]);
    let tasksReducer = useSelector(state => state.tasksReducer);   

    const selfAssign =  (props) => {
        let data = { id: props.id, data: props, date: new Date(), resourceNokiaID:sessionStorage.getItem('nokiaid')}
        axios.post( config.baseURL + config.baseLOCATION + '/dailyTasks/selfassign', data).then(
            res => {
                dispatch(onDeleteTask(props.id))
            }
        )
    }

    const OnSubmit = () => {
        axios.post( config.baseURL + config.baseLOCATION + '/dailyTasks/tasktransfer');
        window.location.reload(false);
    }


    
        return (
                <Container>
                     <Form onSubmit={handleSubmit(OnSubmit)}>
                        <Button type="submit">Transfer Planning to Scheduler</Button>
                    </Form>
                    <Row>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>
                                        Task
                                </th>
                                    <th>
                                        Project
                                </th>
                                    <th>
                                        Resource Name
                                </th>
                                    <th>
                                        TT
                                </th>
                                    <th>
                                        Status
                                </th>
                                    <th>
                                        Site
                                </th>
                                <th>
                                        Start
                                </th>

                                <th>
                                        End
                                </th>

                                <th>
                                        Actions
                                </th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tasksReducer.tasks.map((task, index) => {
                                        return (
                                            <tr key={task.id}> 
                                                <td>{task.task}</td>
                                                <td>{task.projectName}</td>
                                                <td>{task.resourceName}</td>
                                                <td>{task.tt}</td>
                                                <td>{task.status}</td>
                                                <td>{task.site}</td>
                                                <td>{task.start}</td>
                                                <td>{task.end}</td>
                                                <td>
                                                    <Container>
                                                        <Row>
                                                            {/* <Col xs={7}>{task.site}</Col> */}
                                                            <Col>
                                                                <Button variant="danger" onClick={() => dispatch(onDeleteTask(task.id))}>
                                                                    Delete
                                                            </Button>
                                                            </Col>
                                                            <Col>
                                                                <Button variant="primary" onClick={() => {
                                                                    setModalShow(true);
                                                                    setTaskIndex(index);
                                                                }}>
                                                                    Edit
                                                            </Button>
                                                            <Button variant="primary" onClick={() => {
                                                                   selfAssign(task)
                                                                }}>
                                                                    Self-assign
                                                            </Button>
                                                            </Col>
                                                        </Row>
                                                    </Container>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                    </Row>
                    <OnEditModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        index={taskIndex}
                    />
                </Container>

            // </motion.div>

        );
    
}

export default Tasks;