abstract class Config {
    public port: number;
    public youtubeApiKey: string;
    public baseAPiUrl: string;
}

class DevelopmentConfig extends Config {
    public constructor() {
        super();
        this.port = +process.env.PORT;
        this.youtubeApiKey = process.env.YOUTUBE_API_KEY;
        this.baseAPiUrl = process.env.BASE_API_URL;
    }
}

class ProductionConfig extends Config {
    public constructor() {
        super();
        this.port = +process.env.PORT;
    }
}

const config = process.env.ENVIRONMENT === "development" ? new DevelopmentConfig() : new ProductionConfig();

export default config;