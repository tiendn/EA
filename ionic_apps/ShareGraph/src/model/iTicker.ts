export interface iTicker {
    InstrumentId: number;
    Date: string;
    Open: Float32Array;
    High: Float32Array;
    Low: Float32Array;
    Volume: Float32Array;
    PrevClose: Float32Array;
    Last: Float32Array;
}