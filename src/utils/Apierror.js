class ApiError extends Error {
    constructor(message= "something went wrong", statusCode,error=[],statck=""){
        super(message);
        this.statusCode = statusCode;
        this.error = error;
        this.stack = statck;
        this.success = false;
        this.data = null;
        if(statck){
            this.stack = statck;
        }
        else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
export { ApiError };