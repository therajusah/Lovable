export declare const createFile: import("ai").Tool<{
    location: string;
    content: string;
}, string>;
export declare const updateFile: import("ai").Tool<{
    location: string;
    content: string;
}, string>;
export declare const deleteFile: import("ai").Tool<{
    location: string;
}, string>;
export declare const readFile: import("ai").Tool<{
    location: string;
}, string>;
export declare const runCommand: import("ai").Tool<{
    command: string;
}, string>;
export declare const tools: {
    createFile: import("ai").Tool<{
        location: string;
        content: string;
    }, string>;
    updateFile: import("ai").Tool<{
        location: string;
        content: string;
    }, string>;
    deleteFile: import("ai").Tool<{
        location: string;
    }, string>;
    readFile: import("ai").Tool<{
        location: string;
    }, string>;
    runCommand: import("ai").Tool<{
        command: string;
    }, string>;
};
//# sourceMappingURL=index.d.ts.map