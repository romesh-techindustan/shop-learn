import cameraCategoryIcon from "../assets/icons/Category-Camera.svg";
import cellphoneIcon from "../assets/icons/Category-CellPhone.svg";
import computerIcon from "../assets/icons/Category-Computer.svg";
import gamepadCategoryIcon from "../assets/icons/Category-Gamepad.svg";
import headphoneIcon from "../assets/icons/Category-Headphone.svg";
import smartwatchIcon from "../assets/icons/Category-SmartWatch.svg";

export const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const categoryData=[
    { label: "Phones", image: cellphoneIcon },
    { label: "Computers", image: computerIcon },
    { label: "SmartWatch", image: smartwatchIcon },
    { label: "Camera", image: cameraCategoryIcon },
    { label: "HeadPhones", image: headphoneIcon },
    { label: "Gaming", image: gamepadCategoryIcon },
]
