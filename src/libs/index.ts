import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();
export const SALT: string | undefined = process.env.REACT_APP_SECRET_KEY;

export const encrypt = async (hashed: string) => {
  let dataHashed = JSON.stringify(hashed);

  let hash = CryptoJS.AES.encrypt(dataHashed, SALT ?? "").toString();

  return hash;
};

export const decrypt = async (hashed: string) => {
  try {
    let bytes = CryptoJS.AES.decrypt(hashed, SALT ?? "");
    let result = await JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    return result;
  } catch (e) {
    return null;
  }
};

export const setCookies = async (name: string, data: string) => {
  let expired = new Date();
  expired.setTime(expired.getTime() + 1 * 24 * 60 * 60 * 1000);
  // 24 Hour

  const cookiesEncrypt = await encrypt(data);
  cookies.set(name, cookiesEncrypt.toString(), {
    path: "/",
    expires: expired,
  });
};

export const getCookies = async (name: string) => {
  const dataCookies = await cookies.get(name.toString());

  if (dataCookies) {
    const data = await decrypt(dataCookies);
    return data;
  } else {
    return null;
  }
};

export const deleteCookies = (name: string) => {
  const data = cookies.remove(name, { path: "/" });

  return data;
};

export const autoid = (id: number) => {
  const str = "" + id;
  const pad = "0000";
  const ans = pad.substring(0, pad.length - str.length) + str;

  return ans;
};

export const upperCase = (text: string) => {
  const string = text.toString();
  let splitString = string.toLowerCase().split(" ");
  for (let i = 0; i < splitString.length; i++) {
    // You do not need to check if i is larger than splitString length, as your for does that for you
    // Assign it back to the array
    splitString[i] =
      splitString[i].charAt(0).toUpperCase() + splitString[i].substring(1);
  }
  // Directly return the joined string
  return splitString.join(" ");
};

export const useWindowsSize = () => {
  const [windowSize, setWindowSize] = useState<any>({
    width: undefined,
    height: undefined,
  });
  function handleResize() {
    // Set window width/height to state
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== "undefined") {
      // Handler to call on window resize
      handleResize();
      // Add event listener
      window.addEventListener("resize", handleResize);

      // Call handler right away so state gets updated with initial window size
      handleResize();

      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
};
