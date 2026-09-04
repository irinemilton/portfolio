declare module 'gsap/all' {
    interface ObserverInstance {
        kill(): void;
    }

    interface ObserverConfig {
        target: Element;
        type: string;
        tolerance?: number;
        wheelSpeed?: number;
        onUp?: () => void;
        onDown?: () => void;
    }

    export const Observer: {
        create(config: ObserverConfig): ObserverInstance;
    };
}
