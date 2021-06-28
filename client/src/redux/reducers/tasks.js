import axios from 'axios'
import { config } from "../../config"

const initialState = {
    tasks: []
};

const tasksReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'DELETE':   
        const tasks = {
            ...state,
            tasks: state.tasks.filter((task, id) => task.id !== action.payload.index),
        }
        axios.delete(config.baseURL + config.baseLOCATION  + `/dailyTasks/${action.payload.index}`)
            .catch(err => {
                console.log(err);
            });
        return tasks;
    case 'SET TASK':
        axios.put(config.baseURL + config.baseLOCATION  + `/dailyTasks/${action.payload.id}`, action.payload.data)
            .catch(err => {
                console.log(err);
            });
        return ({
            ...state,
            tasks: state.tasks.map((task, index) => {
                if (index !== action.payload.index) {
                    return task;
                }
                return action.payload.data;
            })
        });
        case 'GET TASKS': return ({
            ...state,
            tasks: action.payload.data,
        });
        default: return { ...state };
    }


}

export default tasksReducer;