export const onDeleteTask = (index) => {
    return {
        type: 'DELETE',
        payload: {
            index: index
        }
    }
}