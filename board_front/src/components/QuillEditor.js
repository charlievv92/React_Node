import React, { forwardRef, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const formats = [
  "font",
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "align",
  "color",
  "background",
  "size",
  "h1",
  "link",
  "image",
  "video",
];
const QuillEditor = forwardRef(({ value, onChange, modules, style }, ref) => {
  // const quillRef = useRef(null);

  // useEffect(() => {
  //   if (quillRef.current) {
  //     console.log(quillRef.current);
  //   }
  // }, []);
  // const [values, setValues] = useState("");

  // console.log(values); // Use the 'values' state variable

  const defaultModules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ size: ["small", false, "large", "huge"] }],
          [{ align: [] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [
            {
              color: [],
            },
            { background: [] },
          ],
          ["link", "image", "video"],
        ],
      },
    };
  }, []);

  return (
    <ReactQuill
      theme="snow"
      modules={modules || defaultModules}
      formats={formats}
      value={value}
      onChange={onChange}
      style={style}
    />
  );
});

export default QuillEditor;
