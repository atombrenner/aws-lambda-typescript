export default class ErrorResponse {
    constructor(
        readonly code: number,
        readonly message: string
    ) {}
}
