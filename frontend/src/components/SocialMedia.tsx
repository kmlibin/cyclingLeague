import React from "react";
import './SocialMedia.css'
import {
  BsStrava,
  BsFacebook,
  BsTwitter,
  BsInstagram,
  BsFillGearFill,
  BsGlobe2,
} from "react-icons/bs";
type Props = {
  socialUrls: { icon: string; href: string }[];
};
const SocialMedia: React.FC<Props> = ({ socialUrls }) => {
  console.log(socialUrls);
  return (
    <div className = "socials">
      {socialUrls.map((item) => (
        <a href={item.href} target="blank" key={item.icon}>
          {item.icon == "strava" ? (
            <BsStrava color="FC4C02" />
          ) : item.icon == "facebook" ? (
            <BsFacebook color="#0165E1"/>
          ) : item.icon == "instagram" ? (
            <BsInstagram color="#833AB4"/>
          ) : item.icon == "twitter" ? (
            <BsTwitter color= "#1DA1F2" />
          ) : item.icon == "Cyclo-cross" ? (
            <BsFillGearFill color="#654321"/>
          ) : (
            <BsGlobe2 color="#6a6a6a"/>
          )}
          &nbsp;
          {item.icon == 'site' ? "personal" : item.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialMedia;
