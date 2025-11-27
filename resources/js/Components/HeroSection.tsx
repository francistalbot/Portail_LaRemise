export const HeroSection = () => {
    return (
        <div className="relative bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <img
                    className="w-full h-auto"
                    src="/images/hero.png"
                    //  srcSet="/images/hero150x150.png,/images/hero768x520.png,/images/hero1024x693.png,/images/hero1536x1040.png,"
                    alt="Hero Image"
                    loading="lazy"
                    decoding="async"
                    style={{
                        background:
                            "url(/images/hero150x150.png) center/cover #eee",
                    }}
                />
            </div>
        </div>
    );
};
