export interface Config {
    ZENO_HABIT_BFF_BASE_URI: string
}

declare global {
    interface Window {
        ENV: {
            ZENO_HABIT_BFF_BASE_URI: string
        }
    }
}

const createConfig = (): Config => {
    return {
        ZENO_HABIT_BFF_BASE_URI: window?.ENV?.ZENO_HABIT_BFF_BASE_URI ?? 'http://localhost:40000'
    }
}

const config = createConfig();

export default config;