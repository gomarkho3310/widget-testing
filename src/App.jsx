import { useState, useRef, useEffect } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

function App({ wkey }) {
  const [show, setShow] = useState(false);
  const [data, setData] = useState(null);
  const [overlay, setOverlay] = useState(false);
  var phone = null;
  const [country_calling_code, setCountryCallingCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const formRef = useRef(null);

  // use effect
  useEffect(() => {
    // handle click outside
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target))
        setShow(false);
    }
    if (show) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);

    // api call
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://app.spotcalls.com:8001/v1/pub/widgets/${wkey}`
        );
        setLoading(false);
        setData(response.data.data);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();

    axios
      .get("https://ipinfo.io/json/")
      .then((response) => {
        setCountryCallingCode(response.data.country.toLowerCase());
      })
      .catch((error) => {
        console.error("Error fetching geolocation data", error);
        setCountryCallingCode("ae");
      });

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // working hours check
  function isInWorkingHours(workingHours, currentTime) {
    const currentDay = currentTime.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const todaysWorkingHours = workingHours?.find(
      (day) => day.day === currentDay
    );
    if (todaysWorkingHours) {
      const startTime = new Date(todaysWorkingHours.start_time).getUTCHours();
      const startMinute = new Date(
        todaysWorkingHours.start_time
      ).getUTCMinutes();

      const endTime = new Date(todaysWorkingHours.end_time).getUTCHours();
      const endMinute = new Date(todaysWorkingHours.end_time).getUTCMinutes();

      if (
        (currentHour > startTime ||
          (currentHour === startTime && currentMinute >= startMinute)) &&
        (currentHour < endTime ||
          (currentHour === endTime && currentMinute <= endMinute))
      )
        return true;
    }
    return false;
  }
  const currentTime = new Date();
  const working = isInWorkingHours(
    data?.call_routing?.working_hours,
    currentTime
  );

  // form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formDataObject = Object.fromEntries(formData.entries());
    await axios.post(
      "https://app.spotcalls.com:8002/v1/pub/call",
      {
        name: formDataObject.name,
        phone_number: phone,
      },
      {
        headers: {
          WIDGET_KEY: wkey,
        },
      }
    );
  };

  const styles = {
    main: {
      position: "relative",
      zIndex: 50,
      fontFamily: data?.design?.font_family || "helvetica",
      height: "100vh",
    },
    blackOverlay: {
      position: "absolute",
      top: "0%",
      left: "0%",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0 , 0 , 0 , 0.5)",
      zIndex: "999",
    },
    openButton: {
      position: "fixed",
      bottom: "2.5rem",
      right: "2.5rem",
      borderRadius: "4px",
      height: "5rem",
      width: "5rem",
      backgroundColor: data?.design?.widget_button_color || "#90cdf4",
      padding: "0.75rem",
      border: "none",
      outline: "none",
      zIndex: 1000,
    },
    wrapper: {
      backgroundImage: data?.design?.background_image
        ? `url(${data?.design?.background_image})`
        : "url(https://wallpapers.com/images/high/city-background-67ymlv38i2n66bvd.webp)",
      backgroundSize: "100% 75%",
      backgroundRepeat: "no-repeat",
      backgroundColor: data?.design?.background_color || "#ffffff",
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "0.5rem",
      borderWidth: "1px",
      width: "23rem",
      height: "23rem",
      boxShadow: "0 4px 100px rgba(0, 0, 0, 0.1)",
      zIndex: 1000,
    },
    wave_svg: {
      position: "absolute",
      bottom: "23%",
      left: -0.8,
    },
    upperSection: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      color: "#ffffff",
      width: "100%",
      position: "relative",
      margin: "40px 0 0 0",
    },
    upperSection_logo: {
      widht: "3rem",
      height: "3rem",
      position: "absolute",
      top: "7%",
    },
    upperSection_name: {
      fontSize: "0.806rem",
      fontWeight: "600",
    },
    upperSection_title: {
      textAlign: "center",
      color: data?.design?.title_color || "white",
      fontWeight: "bold",
      fontSize: "1em",
      lineHeight: "1em",
      margin: "0 0 10px 0",
    },
    upperSection_subtitle: {
      textAlign: "center",
      color: data?.design?.sub_text_color || "white",
      fontSize: "0.9em",
      lineHeight: "0.9em",
      fontWeight: "bold",
    },
    upperSection_subtitle_span: {
      color: "0.888rem",
      fontWeight: 400,
    },
    lowerSection: {
      display: "flex",
      paddingBottom: "1rem",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: data?.design?.form_background_color || "#ffffff",
      borderRadius: "0.313rem",
      padding: "1.2rem 1.325rem",
      zIndex: 10,
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.25)",
      width: "75%",
      gap: "0.1rem",
    },
    form_submitButton: {
      background: data?.design?.form_button_color || "#90cdf4",
      color: data?.design?.form_text_color || "white",
      fontSize: "0.825em",
      lineHeight: "1em",
      paddingLeft: "0.75rem",
      paddingRight: "0.75rem",
      borderRadius: "3px",
      fontWeight: "900",
      border: "none",
      outline: "none",
      cursor: "pointer",
    },
    form_label: {
      fontSize: "0.775em",
      lineHeight: "1em",
      color: "#213A52",
    },
    form_input: {
      padding: "0 10px 0 10px",
      borderRadius: "0.188rem",
      border: "1px solid hsl(208, 18%, 75%)",
      outline: "none",
      height: "2rem",
    },
  };

  return (
    <div style={styles.main}>
      {show && (
        <div style={styles.blackOverlay}>
          <div id="widget-container" ref={formRef} style={styles.wrapper}>
            {data?.design?.logo && (
              <img
                src={data?.design?.logo}
                alt="Ahyan Real State"
                style={styles.upperSection_logo}
              />
            )}
            {!data?.design?.logo && (
              <svg
                id="Layer_1"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 114.4 80"
                style={styles.upperSection_logo}
                fill="#bba57a"
              >
                <defs></defs>
                <path
                  className="cls-1"
                  d="M15,68.19H11.52l-.65,1.62H8.46l3.68-8.32h2.31l3.69,8.32H15.69Zm-.69-1.74-1.07-2.66-1.07,2.66Z"
                />
                <path
                  className="cls-1"
                  d="M26.72,61.49v8.32H24.37V66.56H21.16v3.25H18.8V61.49h2.36v3.12h3.21V61.49Z"
                />
                <path
                  className="cls-1"
                  d="M32.84,66.82v3H30.49v-3l-3.18-5.3H29.8l2,3.3,2-3.3H36Z"
                />
                <path
                  className="cls-1"
                  d="M41.67,68.19H38.15l-.65,1.62H35.1l3.67-8.32h2.32l3.69,8.32H42.33ZM41,66.45l-1.07-2.66-1.07,2.66Z"
                />
                <path
                  className="cls-1"
                  d="M53.36,61.49v8.32H51.42l-3.67-4.44v4.44H45.44V61.49h1.94l3.67,4.43V61.49Z"
                />
                <path
                  className="cls-1"
                  d="M64.05,65.47h2.08v3.44a5.1,5.1,0,0,1-1.64.79,6.52,6.52,0,0,1-1.85.27,4.91,4.91,0,0,1-2.35-.55,4.06,4.06,0,0,1-1.64-1.54,4.46,4.46,0,0,1,0-4.47,4,4,0,0,1,1.65-1.54,5,5,0,0,1,2.39-.55,5.37,5.37,0,0,1,2.09.39,4,4,0,0,1,1.54,1.13L64.83,64.2a2.65,2.65,0,0,0-2-.93,2.32,2.32,0,0,0-1.73.65,2.35,2.35,0,0,0-.65,1.73,2.49,2.49,0,0,0,.3,1.23,2,2,0,0,0,.83.84,2.42,2.42,0,0,0,1.22.3,3,3,0,0,0,1.27-.27Z"
                />
                <path
                  className="cls-1"
                  d="M71.27,67.6H70v2.21H67.63V61.49h3.8a4.78,4.78,0,0,1,2,.37,2.82,2.82,0,0,1,1.73,2.7,2.91,2.91,0,0,1-.42,1.58,2.77,2.77,0,0,1-1.21,1l1.8,2.62H72.78Zm1.12-3.94a1.68,1.68,0,0,0-1.1-.32H70v2.44h1.31a1.68,1.68,0,0,0,1.1-.32,1.13,1.13,0,0,0,.36-.9A1.16,1.16,0,0,0,72.39,63.66Z"
                />
                <path
                  className="cls-1"
                  d="M78.25,69.41a4.15,4.15,0,0,1-1.65-1.54,4.25,4.25,0,0,1,1.65-6,5.3,5.3,0,0,1,4.74,0,4.3,4.3,0,0,1,1.65,6A4.15,4.15,0,0,1,83,69.41a5.3,5.3,0,0,1-4.74,0Zm3.51-1.68a2.18,2.18,0,0,0,.81-.84,2.73,2.73,0,0,0,0-2.49,2.09,2.09,0,0,0-.81-.83,2.32,2.32,0,0,0-2.28,0,2.09,2.09,0,0,0-.81.83,2.82,2.82,0,0,0,0,2.49,2.18,2.18,0,0,0,.81.84,2.39,2.39,0,0,0,2.28,0Z"
                />
                <path
                  className="cls-1"
                  d="M87.44,69a3.81,3.81,0,0,1-1-2.86V61.49h2.35V66c0,1.33.53,2,1.58,2s1.57-.66,1.57-2V61.49h2.32V66.1a3.81,3.81,0,0,1-1,2.86,4.61,4.61,0,0,1-5.76,0Z"
                />
                <path
                  className="cls-1"
                  d="M101.59,61.86a2.82,2.82,0,0,1,1.73,2.7,2.91,2.91,0,0,1-.45,1.63,2.94,2.94,0,0,1-1.28,1.07,4.76,4.76,0,0,1-2,.37H98.18v2.18H95.82V61.49h3.81A4.76,4.76,0,0,1,101.59,61.86Zm-1,3.6a1.14,1.14,0,0,0,.37-.9,1.17,1.17,0,0,0-.37-.9,1.66,1.66,0,0,0-1.1-.32h-1.3v2.44h1.3A1.66,1.66,0,0,0,100.58,65.46Z"
                />
                <path
                  className="cls-1"
                  d="M2.6,77.15A1.6,1.6,0,0,1,2,76.56a1.57,1.57,0,0,1-.22-.84,1.55,1.55,0,0,1,.84-1.43,1.82,1.82,0,0,1,.88-.21,2,2,0,0,1,.74.14,1.56,1.56,0,0,1,.56.42l-.47.44a1,1,0,0,0-.8-.38,1.11,1.11,0,0,0-.52.13.89.89,0,0,0-.36.36,1.15,1.15,0,0,0,0,1.06.89.89,0,0,0,.36.36,1.11,1.11,0,0,0,.52.12,1,1,0,0,0,.8-.37l.47.43a1.36,1.36,0,0,1-.56.42,1.79,1.79,0,0,1-.75.15A1.81,1.81,0,0,1,2.6,77.15Z"
                />
                <path
                  className="cls-1"
                  d="M6.76,77.15a1.67,1.67,0,0,1-.62-.59,1.62,1.62,0,0,1,.62-2.27,2,2,0,0,1,1.78,0,1.66,1.66,0,0,1,.62,2.27,1.67,1.67,0,0,1-.62.59,2,2,0,0,1-1.78,0Zm1.4-.54a.93.93,0,0,0,.35-.36,1.15,1.15,0,0,0,0-1.06.93.93,0,0,0-.35-.36,1.07,1.07,0,0,0-1,0,.93.93,0,0,0-.35.36,1.15,1.15,0,0,0,0,1.06.93.93,0,0,0,.35.36,1.14,1.14,0,0,0,1,0Z"
                />
                <path
                  className="cls-1"
                  d="M13.73,77.31V75.4L12.79,77h-.33l-.93-1.53v1.87h-.69V74.13h.61l1.19,2,1.17-2h.6v3.18Z"
                />
                <path
                  className="cls-1"
                  d="M19,77.31V75.4L18,77h-.33l-.93-1.53v1.87h-.68V74.13h.6l1.19,2,1.17-2h.6v3.18Z"
                />
                <path className="cls-1" d="M21.31,74.13H22v3.18h-.73Z" />
                <path
                  className="cls-1"
                  d="M24.36,74.73h-1v-.6h2.77v.6h-1v2.58h-.73Z"
                />
                <path
                  className="cls-1"
                  d="M28.11,74.73h-1v-.6h2.77v.6h-1v2.58h-.73Z"
                />
                <path
                  className="cls-1"
                  d="M33.61,76.72v.59H31.16V74.13h2.39v.59H31.89v.69h1.47V76H31.89v.74Z"
                />
                <path
                  className="cls-1"
                  d="M35.1,74.13h1.44a2.08,2.08,0,0,1,.92.2,1.44,1.44,0,0,1,.61.56,1.49,1.49,0,0,1,.22.83,1.51,1.51,0,0,1-.22.83,1.44,1.44,0,0,1-.61.56,2.08,2.08,0,0,1-.92.2H35.1Zm1.41,2.57a1.11,1.11,0,0,0,.76-.26,1.07,1.07,0,0,0,0-1.44,1.06,1.06,0,0,0-.76-.26h-.67v2Z"
                />
                <path
                  className="cls-1"
                  d="M42.59,74.73h-1v-.6h2.76v.6h-1v2.58h-.74Z"
                />
                <path
                  className="cls-1"
                  d="M46.24,77.15a1.67,1.67,0,0,1-.62-.59,1.62,1.62,0,0,1,.62-2.27,1.89,1.89,0,0,1,.89-.21,1.86,1.86,0,0,1,.89.21,1.63,1.63,0,0,1,.62,2.27,1.67,1.67,0,0,1-.62.59,1.86,1.86,0,0,1-.89.21A1.89,1.89,0,0,1,46.24,77.15Zm1.4-.54a1,1,0,0,0,.36-.36,1.15,1.15,0,0,0,0-1.06,1,1,0,0,0-.36-.36,1,1,0,0,0-1,0,1,1,0,0,0-.36.36,1.15,1.15,0,0,0,0,1.06,1,1,0,0,0,.36.36,1.06,1.06,0,0,0,.5.12A1.07,1.07,0,0,0,47.64,76.61Z"
                />
                <path
                  className="cls-1"
                  d="M52.83,77.26a1.72,1.72,0,0,1-.56-.27l.25-.55a1.54,1.54,0,0,0,.48.24,1.82,1.82,0,0,0,.56.09.91.91,0,0,0,.46-.09.29.29,0,0,0,.15-.25.27.27,0,0,0-.08-.19.71.71,0,0,0-.23-.12l-.37-.1a3.76,3.76,0,0,1-.6-.17,1,1,0,0,1-.39-.28.72.72,0,0,1-.17-.5.87.87,0,0,1,.15-.5,1,1,0,0,1,.45-.36,1.82,1.82,0,0,1,.74-.13,2.32,2.32,0,0,1,.59.07,2,2,0,0,1,.51.21l-.23.56a1.73,1.73,0,0,0-.88-.25.77.77,0,0,0-.45.1.29.29,0,0,0-.15.26.25.25,0,0,0,.17.24,2.16,2.16,0,0,0,.52.16,5,5,0,0,1,.59.17,1,1,0,0,1,.4.27.76.76,0,0,1,.16.51.86.86,0,0,1-.15.49,1,1,0,0,1-.45.36,1.85,1.85,0,0,1-.74.13A2.52,2.52,0,0,1,52.83,77.26Z"
                />
                <path
                  className="cls-1"
                  d="M56.66,77a1.46,1.46,0,0,1-.38-1.07V74.13H57v1.75c0,.57.23.85.71.85a.65.65,0,0,0,.52-.2,1,1,0,0,0,.18-.65V74.13h.73v1.78A1.5,1.5,0,0,1,56.66,77Z"
                />
                <path
                  className="cls-1"
                  d="M62.89,74.27a1.13,1.13,0,0,1,.48.4,1.14,1.14,0,0,1,.17.61,1.09,1.09,0,0,1-.17.61,1,1,0,0,1-.48.4,1.79,1.79,0,0,1-.73.14h-.64v.88h-.73V74.13h1.37A1.79,1.79,0,0,1,62.89,74.27Zm-.27,1.42a.48.48,0,0,0,.17-.41.5.5,0,0,0-.17-.41.78.78,0,0,0-.5-.14h-.6v1.1h.6A.73.73,0,0,0,62.62,75.69Z"
                />
                <path
                  className="cls-1"
                  d="M67.42,76.72v.59H65V74.13h2.4v.59H65.69v.69h1.48V76H65.69v.74Z"
                />
                <path
                  className="cls-1"
                  d="M70.93,77.31l-.61-.89h-.68v.89h-.73V74.13h1.37a1.79,1.79,0,0,1,.73.14,1.13,1.13,0,0,1,.48.4,1.14,1.14,0,0,1,.17.61,1.09,1.09,0,0,1-.17.61,1.06,1.06,0,0,1-.48.4l.71,1Zm-.19-2.44a.78.78,0,0,0-.5-.14h-.6v1.11h.6a.73.73,0,0,0,.5-.15.48.48,0,0,0,.18-.41A.51.51,0,0,0,70.74,74.87Z"
                />
                <path className="cls-1" d="M73.15,74.13h.73v3.18h-.73Z" />
                <path
                  className="cls-1"
                  d="M76.18,77.15a1.67,1.67,0,0,1-.62-.59,1.62,1.62,0,0,1,.62-2.27,1.89,1.89,0,0,1,.89-.21,1.86,1.86,0,0,1,.89.21,1.63,1.63,0,0,1,.62,2.27,1.67,1.67,0,0,1-.62.59,1.86,1.86,0,0,1-.89.21A1.89,1.89,0,0,1,76.18,77.15Zm1.4-.54a1,1,0,0,0,.36-.36,1.15,1.15,0,0,0,0-1.06,1,1,0,0,0-.36-.36,1,1,0,0,0-1,0,1,1,0,0,0-.36.36,1.15,1.15,0,0,0,0,1.06,1,1,0,0,0,.36.36,1.06,1.06,0,0,0,.5.12A1.07,1.07,0,0,0,77.58,76.61Z"
                />
                <path
                  className="cls-1"
                  d="M82.29,77.31l-.61-.89H81v.89h-.73V74.13h1.37a1.83,1.83,0,0,1,.73.14,1.13,1.13,0,0,1,.48.4,1.14,1.14,0,0,1,.17.61,1.09,1.09,0,0,1-.17.61,1.14,1.14,0,0,1-.49.4l.72,1Zm-.19-2.44a.78.78,0,0,0-.5-.14H81v1.11h.6a.73.73,0,0,0,.5-.15.48.48,0,0,0,.17-.41A.5.5,0,0,0,82.1,74.87Z"
                />
                <path
                  className="cls-1"
                  d="M90.12,77.64a.94.94,0,0,1-.37.29,1.13,1.13,0,0,1-.49.1,1.33,1.33,0,0,1-.63-.15,2.77,2.77,0,0,1-.66-.53,1.88,1.88,0,0,1-.77-.28,1.58,1.58,0,0,1-.52-.57,1.67,1.67,0,0,1,0-1.62,1.53,1.53,0,0,1,.62-.59,1.86,1.86,0,0,1,.89-.21,1.82,1.82,0,0,1,.88.21,1.53,1.53,0,0,1,.62.59,1.52,1.52,0,0,1,.23.84,1.56,1.56,0,0,1-.31,1,1.61,1.61,0,0,1-.82.58.82.82,0,0,0,.22.17.59.59,0,0,0,.23,0,.69.69,0,0,0,.51-.23Zm-2.76-1.39a1,1,0,0,0,.36.36,1.07,1.07,0,0,0,.51.12,1.06,1.06,0,0,0,.5-.12,1,1,0,0,0,0-1.78,1,1,0,0,0-1,0,1,1,0,0,0-.36.36,1.15,1.15,0,0,0,0,1.06Z"
                />
                <path
                  className="cls-1"
                  d="M91.77,77a1.46,1.46,0,0,1-.38-1.07V74.13h.74v1.75c0,.57.23.85.7.85a.66.66,0,0,0,.53-.2,1,1,0,0,0,.18-.65V74.13h.73v1.78A1.5,1.5,0,0,1,91.77,77Z"
                />
                <path
                  className="cls-1"
                  d="M97.92,76.63H96.44l-.28.68h-.75l1.41-3.18h.73L99,77.31H98.2Zm-.23-.56-.51-1.22-.5,1.22Z"
                />
                <path
                  className="cls-1"
                  d="M100.2,74.13h.74v2.58h1.59v.6H100.2Z"
                />
                <path className="cls-1" d="M103.85,74.13h.73v3.18h-.73Z" />
                <path
                  className="cls-1"
                  d="M106.89,74.73h-1v-.6h2.76v.6h-1v2.58h-.74Z"
                />
                <path
                  className="cls-1"
                  d="M111.41,76.18v1.13h-.74V76.17l-1.22-2h.77l.85,1.41.85-1.41h.72Z"
                />
                <path
                  className="cls-1"
                  d="M49.12,17.54a3.35,3.35,0,0,0,.06,3.05c3.06,6.89,6.13,13.78,9,20.73,1.57,3.77.65,7.56-2.15,9.82a23.42,23.42,0,0,1-3.16,1.8h30a22,22,0,0,1-8.81-10.51Q65.36,22.77,56.68,3.09c-.15-.32-.36-.61-.66-1.12-2.37,5.36-4.59,10.49-6.9,15.57"
                />
                <path
                  className="cls-1"
                  d="M29.32,53H43.88c-4.49-2-6.12-5.38-5.78-10.06A22.37,22.37,0,0,1,29.32,53"
                />
              </svg>
            )}
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                paddingTop: "4rem",
                paddingBottom: "2rem",
              }}
            >
              {/* image and text */}
              <section style={styles.upperSection}>
                <h1 style={styles.upperSection_title}>
                  {working
                    ? data?.texts?.title_text || "Get call within 55 seconds"
                    : data?.texts?.out_title_text ||
                      "Get call within 55 seconds"}
                </h1>
                <p style={styles.upperSection_subtitle}>
                  {working
                    ? data?.texts?.sub_text || "Leave your number below"
                    : data?.texts?.out_sub_text || "Leave your number below"}
                </p>
              </section>
              {/* form */}
              <section style={styles.lowerSection}>
                <form
                  id="widget-container-form"
                  style={styles.form}
                  onSubmit={handleSubmit}
                >
                  <label style={styles.form_label} htmlFor="name">
                    Name{" "}
                    <span
                      style={{
                        fontSize: "0.75em",
                        lineHeight: "0.875em",
                        opacity: 0.7,
                      }}
                    >
                      (required)
                    </span>
                  </label>
                  <input
                    name="name"
                    type="text"
                    style={styles.form_input}
                    id="widget-container-form-input"
                    required
                  />
                  <label
                    style={{ ...styles.form_label, marginTop: "0.3rem" }}
                    htmlFor="name"
                  >
                    Enter your number{" "}
                    <span
                      style={{
                        fontSize: "0.75em",
                        lineHeight: "0.875em",
                        opacity: 0.7,
                      }}
                    >
                      (The call is free)
                    </span>
                  </label>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "1rem",
                    }}
                  >
                    {/* <input
                    name="phone_number"
                    type="tel"
                    style={{
                      ...styles.form_input,
                      flex: "1 1 75%",
                    }}
                  /> */}
                    <PhoneInput
                      country={country_calling_code}
                      inputProps={{
                        required: true,
                      }}
                      inputStyle={{
                        ...styles.form_input,
                        flex: "1 1 75%",
                        width: "100%",
                        paddingLeft: "3rem",
                        fontSize: "0.8em",
                      }}
                      onChange={(num) => (phone = num)}
                    />
                    <button
                      type="submit"
                      style={{
                        ...styles.form_submitButton,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {working
                        ? data?.texts?.button_text || "Call me!"
                        : data?.texts?.out_button_text || "Call me!"}
                    </button>
                  </div>
                </form>
              </section>
            </div>
            {/* wave */}
            <svg
              style={styles.wave_svg}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
            >
              <path
                fill={
                  data?.design?.background_color
                    ? data?.design?.background_color
                    : "#ffffff"
                }
                fillOpacity="1"
                d="M0,64L30,74.7C60,85,120,107,180,138.7C240,171,300,213,360,240C420,267,480,277,540,277.3C600,277,660,267,720,256C780,245,840,235,900,202.7C960,171,1020,117,1080,117.3C1140,117,1200,171,1260,208C1320,245,1380,267,1410,277.3L1440,288L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShow(!show);
        }}
        style={styles.openButton}
        id="widget-container-trigger"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="3"
            cy="3"
            r="3"
            transform="matrix(-1 0 0 1 22 2)"
            stroke="#1C274C"
            strokeWidth="1.5"
          />
          <path
            d="M14 2.20004C13.3538 2.06886 12.6849 2 12 2C10.1786 2 8.47087 2.48697 7 3.33782M21.8 10C21.9311 10.6462 22 11.3151 22 12C22 17.5228 17.5228 22 12 22C10.4003 22 8.88837 21.6244 7.54753 20.9565C7.19121 20.7791 6.78393 20.72 6.39939 20.8229L4.17335 21.4185C3.20701 21.677 2.32295 20.793 2.58151 19.8267L3.17712 17.6006C3.28001 17.2161 3.22094 16.8088 3.04346 16.4525C2.37562 15.1116 2 13.5997 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
            stroke="#1C274C"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

export default App;
