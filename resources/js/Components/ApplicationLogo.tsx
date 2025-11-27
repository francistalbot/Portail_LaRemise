import React from "react";

export default function ApplicationLogo(
    props: React.ImgHTMLAttributes<HTMLImageElement>
) {
    return (
        <>
            <img
                src="/images/logo.png"
                alt="Logo"
                {...props}
                loading="lazy"
                decoding="async"
            />
        </>
    );
}
