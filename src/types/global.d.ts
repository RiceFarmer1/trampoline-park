type FirstParam<T> = T extends (callback: infer U, ...args: unknown[]) => unknown 
    ? U 
    : T extends { listen: (callback: infer U, ...args: unknown[]) => unknown }
        ? U
        : never;