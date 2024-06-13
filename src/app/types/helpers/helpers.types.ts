export interface IValidatePayloadParams {
    payloads: any,
    validators: string[],
    rules?: object
}

export interface IValidatePayloadResponse{
    isValid: boolean;
    errorMessage?: string;
}
