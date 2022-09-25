const types: Set<string> = new Set<string>();

function enable(type: string): boolean {
    if (!types.has(type)) { 
        types.add(type);
        return true;
    }
    return false;
}

function disable(type: string): boolean { 
    if (types.has(type)) {
        types.delete(type);
        return true;
    }
    return false;
}

function print(type: string, msg: string): void {
    if (types.has(type)) {
        console.log(`Type: ${type} Message: ${msg}`);
    }
}

function warn(type: string, msg: string): void {
        if (types.has(type)) {
            console.warn(`Type: ${type} Message: ${msg}`);
        }
}

export const Debugger = {
    enable, disable, print, warn
}

