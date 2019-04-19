import sampleData from './sampleData';


//redux thunk for delay
const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}


//feching data from sample data using redux thunk
export const fetchSampleData = () => {
    return delay(1000).then(() => {
        return Promise.resolve(sampleData)
    })
}