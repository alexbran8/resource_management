import React, { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { Table, Container, Row, Col} from 'react-bootstrap'
import { OnEditModal } from '../OnEditModal'
import { onDeleteTask } from '../../redux/actions/tasks/onDeleteTask'
import { getTasks } from "../../redux/actions/tasks/getTasks"
import { config } from "../../config";
import { Button, Modal, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import "./Tasks.scss"
import ExcelReader from '../ExcelReader'

export const Tasks = () => {
    const { handleSubmit } = useForm();    
    const dispatch = useDispatch();
    const [modalShow, setModalShow] = useState(false);
    const [taskIndex, setTaskIndex] = useState(null);
    const [refetch, setRefetch] = useState<Number>(0);

    useEffect( () => {
        axios.get( config.baseURL + config.baseLOCATION + '/dailyTasks', {withCredentials: true})
            .then(res =>{
                dispatch(getTasks(res.data));
            })
            .catch(err =>{
                console.log(err);
            })
    },[refetch]);

    let tasksReducer = useSelector(state => state.tasksReducer);   

    const selfAssign =  (props) => {
        let data = { id: props.id, data: props, date: new Date(), resourceNokiaID:sessionStorage.getItem('nokiaid')}
        axios.post( config.baseURL  + '/dailyTasks/selfassign', data).then(
            res => {
                dispatch(onDeleteTask(props.id))
            }
        )
    }
    function refetchFunction() {
        setRefetch(refetch+1)
    }

    const OnSubmit = () => {
        axios.post( config.baseURL + config.baseLOCATION + '/dailyTasks/tasktransfer');
        window.location.reload(false);
    }


    
        return (
            <div>
            <div className="tasks-button-container">
            {/* <Form className="tasks-form"> */}
               <Button onClick={OnSubmit} className='button' > Transfer to Scheduler</Button>
               <ExcelReader 
               refetch = {refetchFunction}
               />
               {/* <Button type="submit">Transfer Planning to Scheduler</Button> */}
           {/* </Form> */}
           </div>
                <Container>
                   
                   
                    {/* <Row> */}
                        <Table striped hover className='tasks-table'>
                            <thead>
                                <tr>
                                <th>
                                        No.
                                </th>
                                    <th>
                                        Task
                                </th>
                                <th>
                                        Upload Date
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
                                     tasksReducer && tasksReducer.tasks.map((task, index) => {
                                        return (
                                            <tr key={task.id}> 
                                                <td>{index}</td>
                                                <td>{task.task}</td>
                                                <td>{moment(task.crDate).format("YYYY/MM/DD HH:MM")}</td>
                                                <td>{task.projectName}</td>
                                                <td>{task.resourceName}</td>
                                                <td>{task.tt}</td>
                                                <td>{task.status}</td>
                                                <td>{task.site}</td>
                                                <td>{moment(task.start).format("YYYY/MM/DD HH:MM")}</td>
                                                <td>{moment(task.end).format("YYYY/MM/DD HH:MM")}</td>
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
                    {/* </Row> */}
                    <OnEditModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        index={taskIndex}
                    />
                </Container>
                </div>

            // </motion.div>

        );
    
}
