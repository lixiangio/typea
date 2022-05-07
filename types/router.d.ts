interface ObjectIndex {
    [name: string | symbol]: any;
}
export declare function entry(node: any, data: any): any;
export declare function object(node: ObjectIndex, data: any): any;
export declare function array(node: any[], data: any[]): any;
export {};
