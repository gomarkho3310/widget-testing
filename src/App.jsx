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
    form: {
      backgroundColor: "",
    },
    wave: {
      color: "Lavender",
    },
    formButton: {},
    widget: {},
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
          <section className="bg-white h-[40%] flex justify-center items-center w-full py-2">
            <form
              id="widget-container-form"
              className="flex flex-col bg-white p-2 border rounded z-10 text-sm shadow-xl w-[80%] gap-1"
              onSubmit={handleSubmit}
            >
              <label className="text-[11px]" htmlFor="name">
                Name
              </label>
              <input
                name="name"
                type="text"
                className="border border-gray-400 rounded outline-none"
                id="widget-container-form-input"
              />
              <label className="text-[11px]" htmlFor="phone">
                Phone
              </label>
              <div className="flex justify-between">
                <input
                  name="phone"
                  type="tel"
                  className="border border-gray-400 rounded w-[75%] outline-none"
                />
                <button
                  type="submit"
                  className="bg-[#527B97] text-white rounded text-[11px] px-3"
                >
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

{
  /* import "./App.css";
import { useState, useRef, useEffect } from "react";
import logo from "./assets/react.svg";

function App({ bgColor }) {
  const [show, setShow] = useState(false);
  const formRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formDataObject = Object.fromEntries(formData.entries());
    console.log("Form data:", formDataObject);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target))
        setShow(false);
    }
    if (show) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show]);

  const styles = {
    wrapper: {
      backgroundImage: "url(https://source.unsplash.com/user/c_v_r/1900x800)",
      backgroundSize: "100% 60%",
      backgroundRepeat: "no-repeat",
      backgroundColor: "#527B97",
    },
    wave: {
      color: "Lavender",
    },
    form: {
      backgroundColor: "",
    },
    formButton: {},
    widget: {},
  };

  return (
    <div className="relative z-50">
      {show && (
        <div
          id="widget-container"
          ref={formRef}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 rounded flex flex-col items-center justify-center gap-8"
          style={styles.wrapper}
        >
          <svg
            className="absolute top-[34%]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill={`${styles.wave.color}`}
              fill-opacity="1"
              d="M0,256L48,240C96,224,192,192,288,170.7C384,149,480,139,576,154.7C672,171,768,213,864,208C960,203,1056,149,1152,144C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
          <section className="flex flex-col items-center justify-center gap-2">
            <img src={logo} alt="" />
            <h1 className="text-white w-[90%] text-center font-bold">
              Get a call within 55 seconds
            </h1>
            <p className="text-white w-[60%] text-center">
              Leave your number below and we will call you right away!
            </p>
          </section>
          <form
            id="widget-container-form"
            className="flex flex-col gap-1 bg-white p-5 w-[90%] rounded z-10 text-sms"
            onSubmit={handleSubmit}
          >
            <label htmlFor="name">Name</label>
            <input
              name="name"
              type="text"
              className="border-2 border-black rounded"
              id="widget-container-form-input"
            />
            <label htmlFor="phone">Phone</label>
            <input
              name="phone"
              type="tel"
              className="border-2 border-black rounded"
            />
            <button type="submit" className="bg-black text-white rounded py-1">
              Submit
            </button>
          </form>
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          setShow(!show);
        }}
        className="fixed bottom-10 right-10 rounded h-20 w-20 bg-blue-300 p-3"
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

{
  /* <div class="fixed z-10 overflow-y-auto top-0 w-full left-0" id="modal">
          <div class="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity">
              <div class="absolute inset-0 bg-gray-900 opacity-75" />
            </div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>
            <div
              class="inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <img src={logo} alt="" />
              <h1 htmlFor="name">Get a call within 55 seconds</h1>
              <p htmlFor="">
                Leave your number below and we will call you right away!
              </p>
              <form
                id="widget-container-form"
                className="flex flex-col gap-2"
                onSubmit={handleSubmit}
              >
                <input
                  name="name"
                  type="text"
                  className="border-2 border-black rounded"
                  id="widget-container-form-input"
                />
                <label htmlFor="email">Email</label>
                <input
                  name="email"
                  type="text"
                  className="border-2 border-black rounded"
                />
                <button
                  type="submit"
                  className="bg-black text-white rounded py-1"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div> */
}
