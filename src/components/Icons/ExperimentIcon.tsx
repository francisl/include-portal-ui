import * as React from "react";
import cx from "classnames";
import { IconProps } from "components/Icons";

export default ({ width = 24, height = 24, className = "" }: IconProps) => (
  <svg
    id="experiment_icon"
    data-name="Experiment Icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={width}
    height={height}
    fill="currentColor"
    className={cx("anticon", className)}
  >
    <title>icon-experiment</title>
    <path d="M12.0002 11.0625C12.0002 11.3111 12.099 11.5496 12.2748 11.7254C12.4506 11.9012 12.6891 12 12.9377 12C13.1863 12 13.4248 11.9012 13.6006 11.7254C13.7764 11.5496 13.8752 11.3111 13.8752 11.0625C13.8752 10.8139 13.7764 10.5754 13.6006 10.3996C13.4248 10.2238 13.1863 10.125 12.9377 10.125C12.6891 10.125 12.4506 10.2238 12.2748 10.3996C12.099 10.5754 12.0002 10.8139 12.0002 11.0625ZM20.6018 19.3336L16.3197 8.25V4.17188H18.0002V2.57812H6.0002V4.17188H7.68066V8.25L3.39863 19.3336C3.33301 19.507 3.29785 19.6898 3.29785 19.875C3.29785 20.7023 3.97051 21.375 4.79785 21.375H19.2025C19.3877 21.375 19.5705 21.3398 19.7439 21.2742C20.5174 20.9766 20.9018 20.107 20.6018 19.3336ZM9.27441 8.54766V4.21875H14.726V8.54766L16.8564 14.0625C16.3713 13.9383 15.8697 13.875 15.3588 13.875C13.9244 13.875 12.565 14.3789 11.4846 15.2812C10.6871 15.9474 9.68068 16.3117 8.6416 16.3102C7.8752 16.3102 7.13926 16.1156 6.49004 15.7547L9.27441 8.54766ZM4.93379 19.7812L5.91113 17.2547C6.74785 17.6789 7.67832 17.9062 8.64395 17.9062C10.0783 17.9062 11.4377 17.4023 12.5182 16.5C13.3127 15.8391 14.3064 15.4711 15.3611 15.4711C16.1814 15.4711 16.9643 15.6938 17.6486 16.1063L19.0666 19.7812H4.93379Z" />
  </svg>
);
