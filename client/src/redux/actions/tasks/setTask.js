export const setTask = (index, id, data) => {
    return {
        type: 'SET TASK',
        payload: {
            index: index,
            id:id,
            data: data
        }
    }
}