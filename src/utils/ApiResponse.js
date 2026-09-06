class ApiResponse {
    constructor(message = "Request processed successfully", statusCode , data) {
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
        this.success = statusCode < 400;
    }
}
export { ApiResponse }; 