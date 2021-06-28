export const getTasks = (data) => {
    return {
        type: 'GET TASKS',
        payload: {
            data: data
        }
    }
}