import "./App.css";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

function App() {
  const [show, setShow] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const formRef = useRef(null);

  const widgetKey = new URLSearchParams(window.location.search).get(
    "widgetKey"
  );

  // form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formDataObject = Object.fromEntries(formData.entries());
    console.log("Form data:", formDataObject);

    const response = await axios.post(
      "http://3.29.188.19:8443/v1/call",
      formData
    );
  };

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
          `http://3.29.188.19:8443/v1/widgets/${widgetKey}`
        );
        setLoading(false);
        setData(response.data.data);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // styles
  const styles = {
    main: {
      position: "relative",
      zIndex: 50,
      fontFamily: "Roboto, sans-serif",
    },
    openButton: {
      position: "fixed",
      bottom: "2.5rem",
      right: "2.5rem",
      borderRadius: "4px",
      height: "5rem",
      width: "5rem",
      backgroundColor: "#90cdf4",
      padding: "0.75rem",
    },
    wrapper: {
      backgroundImage:
        data?.design?.background_image ||
        "url(https://source.unsplash.com/user/c_v_r/1900x800)",
      backgroundSize: "100% 60%",
      backgroundRepeat: "no-repeat",
      backgroundColor: "#527B97",
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "0.25rem",
      borderWidth: "1px",
      borderColor: "#527B97",
      minWidth: "23.938rem",
      minHeight: "18.063rem",
      height: "25.063rem",
    },
    upperSection: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      justifyContent: "center",
      alignItems: "center",
      color: "#ffffff",
      height: "60%",
    },
    upperSection_name: {
      fontSize: "0.806rem",
      fontWeight: "600",
    },
    upperSection_title: {
      textAlign: "center",
      color: "1.13rem",
      fontWeight: 700,
    },
    upperSection_subtitle: {
      textAlign: "center",
      color: "0.95rem",
      fontWeight: 600,
    },
    upperSection_subtitle_span: {
      color: "0.888rem",
      fontWeight: 400,
    },
    lowerSection: {
      display: "flex",
      paddingTop: "0.5rem",
      paddingBottom: "0.5rem",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      backgroundColor: "#ffffff",
      height: "40%",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#ffffff",
      borderRadius: "0.25rem",
      borderWidth: "1px",
      padding: "0.5rem",
      zIndex: 10,
      fontSize: "0.875rem",
      gap: "0.25rem",
      lineHeight: "1.25rem",
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      width: "80%",
    },
    form_submitButton: {
      background: "#527B97",
      color: "#ffffff",
      fontSize: "11px",
      paddingLeft: "0.75rem",
      paddingRight: "0.75rem",
      borderRadius: "0.25rem",
    },
    form_label: {
      fontSize: "11px",
    },
    form_input: {
      borderRadius: "0.25rem",
      borderWidth: "1px",
      borderColor: "#9CA3AF",
      outlineStyle: "none",
    },
  };

  return (
    <div style={styles.main}>
      {show && (
        <div id="widget-container" ref={formRef} style={styles.wrapper}>
          {/* image and text */}
          <section style={styles.upperSection}>
            <p style={styles.upperSection_name}>Ahyan Real State</p>
            <h1 style={styles.upperSection_title}>
              {data?.design?.title_text || "Get a call within 55 seconds"}
            </h1>
            <p style={styles.upperSection_subtitle}>
              {data?.design?.sub_text || "Leave your number bellow"}
              <br />
              <span style={styles.upperSection_subtitle_span}>
                and we will call you right away!
              </span>
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
                Name
              </label>
              <input
                name="name"
                type="text"
                style={styles.form_input}
                id="widget-container-form-input"
              />
              <label style={styles.form_label} htmlFor="phone">
                Phone
              </label>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <input
                  name="phone"
                  type="tel"
                  style={{ ...styles.form_input, width: "75%" }}
                />
                <button type="submit" style={styles.form_submitButton}>
                  Call me
                </button>
              </div>
            </form>
          </section>
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
