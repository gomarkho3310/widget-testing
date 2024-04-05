import "./App.css";
import { useState, useRef, useEffect } from "react";

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

  return (
    <div className="relative z-50">
      {show && (
        <div
          id="widget-container"
          ref={formRef}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 rounded"
          style={{ backgroundColor: bgColor }}
        >
          <form
            id="widget-container-form"
            className="flex flex-col gap-2"
            onSubmit={handleSubmit}
          >
            <label htmlFor="name">Name</label>
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
