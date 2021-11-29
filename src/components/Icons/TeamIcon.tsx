import * as React from "react";
import { IconProps } from "components/Icons";

export default ({
  width = 24,
  height = 24,
  fill = "#fff",
  className = "",
}: IconProps) => (
  <svg
    id="team_icon"
    data-name="Team Icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={width}
    height={height}
    className={className}
  >
    <title>icon-team</title>
    <path
      className={className}
      // eslint-disable-next-line max-len
      d="M19.3172 16.404C18.7306 15.8169 18.0451 15.3377 17.2922 14.9883C18.354 14.1282 19.0313 12.8157 19.0313 11.3438C19.0313 8.74694 16.8657 6.61647 14.2688 6.65631C11.7118 6.69616 9.65162 8.77975 9.65162 11.3438C9.65162 12.8157 10.3313 14.1282 11.3907 14.9883C10.6377 15.3374 9.95214 15.8166 9.36568 16.404C8.086 17.686 7.35943 19.3782 7.31256 21.1829C7.31193 21.2079 7.31632 21.2328 7.32546 21.2561C7.33461 21.2794 7.34832 21.3006 7.36579 21.3185C7.38327 21.3364 7.40415 21.3506 7.42721 21.3604C7.45027 21.3701 7.47504 21.3751 7.50006 21.3751H8.81256C8.91334 21.3751 8.99772 21.2954 9.00006 21.1946C9.04459 19.8352 9.59537 18.5626 10.5633 17.5969C11.0587 17.099 11.6478 16.7042 12.2968 16.4355C12.9457 16.1667 13.6414 16.0294 14.3438 16.0313C15.7712 16.0313 17.1141 16.5868 18.1243 17.5969C19.0899 18.5626 19.6407 19.8352 19.6876 21.1946C19.6899 21.2954 19.7743 21.3751 19.8751 21.3751H21.1876C21.2126 21.3751 21.2374 21.3701 21.2604 21.3604C21.2835 21.3506 21.3044 21.3364 21.3218 21.3185C21.3393 21.3006 21.353 21.2794 21.3622 21.2561C21.3713 21.2328 21.3757 21.2079 21.3751 21.1829C21.3282 19.3782 20.6016 17.686 19.3172 16.404ZM14.3438 14.3438C13.5422 14.3438 12.7876 14.0321 12.2227 13.4649C11.9392 13.1837 11.7153 12.8482 11.5643 12.4786C11.4133 12.1089 11.3383 11.7126 11.3438 11.3133C11.3508 10.5446 11.6579 9.80162 12.1946 9.25084C12.7571 8.67428 13.5094 8.35319 14.3133 8.34381C15.1079 8.33678 15.879 8.64616 16.4462 9.20162C17.0274 9.77116 17.3462 10.5329 17.3462 11.3438C17.3462 12.1454 17.0344 12.8977 16.4672 13.4649C16.189 13.7445 15.858 13.9661 15.4935 14.117C15.1291 14.2679 14.7383 14.345 14.3438 14.3438ZM8.47272 11.9626C8.45162 11.7587 8.4399 11.5524 8.4399 11.3438C8.4399 10.9712 8.47506 10.6079 8.54068 10.254C8.55709 10.1696 8.51256 10.0829 8.43521 10.0477C8.11647 9.90475 7.8235 9.70787 7.57037 9.45944C7.27211 9.17024 7.0374 8.82203 6.88123 8.43705C6.72506 8.05207 6.65085 7.63876 6.66334 7.2235C6.68443 6.47116 6.98678 5.75631 7.51412 5.21725C8.09303 4.62428 8.87115 4.30084 9.6985 4.31022C10.4462 4.31725 11.168 4.60553 11.7141 5.11647C11.8993 5.28991 12.0587 5.48209 12.1922 5.68834C12.2391 5.761 12.3305 5.79147 12.4102 5.76334C12.8227 5.62037 13.2587 5.51959 13.7063 5.47272C13.8376 5.45866 13.9126 5.31803 13.854 5.20084C13.0922 3.69381 11.536 2.65319 9.736 2.62506C7.13678 2.58522 4.97115 4.71569 4.97115 7.31022C4.97115 8.78209 5.6485 10.0946 6.71022 10.9547C5.9649 11.2993 5.27818 11.7751 4.68287 12.3704C3.3985 13.6524 2.67193 15.3446 2.62506 17.1516C2.62443 17.1766 2.62882 17.2015 2.63796 17.2248C2.64711 17.2481 2.66082 17.2693 2.67829 17.2872C2.69576 17.3052 2.71665 17.3194 2.73971 17.3291C2.76277 17.3388 2.78754 17.3438 2.81256 17.3438H4.1274C4.22818 17.3438 4.31256 17.2641 4.3149 17.1633C4.35943 15.804 4.91022 14.5313 5.87818 13.5657C6.56725 12.8766 7.411 12.3985 8.33209 12.1665C8.4235 12.143 8.48443 12.0563 8.47272 11.9626Z"
      fill={fill}
    />
  </svg>
);
