

export const asyncStart = () => {
    return {
        type: "ASYNC_START"
    }
}


export const asyncFinish = () => {
    return {
        type: "ASYNC_FINISH"
    }
}



export const asyncError = () => {
    return {
        type: "ASYNC_ERROR"
    }
}