import { useState } from "react";
import axios from "axios";
import { Image } from "react-bootstrap";
import { IoCloudUploadOutline } from "react-icons/io5";

const chainSafe_api_key = import.meta.env.VITE_CHAINSAFE_API;
const bucket_id = import.meta.env.VITE_CHAINSAFE_BUCKET_ID;
const maxFileSize = 1048576; // 1 MB

const UploadImage = ({ onCidChange }) => {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    // Verificar se o arquivo excede o limite de 1 MB
    if (file && file.size > maxFileSize) {
      setError(
        "The file exceeds the 1 MB limit. Please select a smaller file."
      );
      setFile(null); // Limpa o arquivo anterior
      setImagePreview(null); // Limpa a imagem anterior
      return;
    }

    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Faz o upload automaticamente após a imagem ser selecionada
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("path", "/");

        const response = await axios.post(
          `https://api.chainsafe.io/api/v1/bucket/${bucket_id}/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${chainSafe_api_key}`,
              "Content-Type": "multipart/form-data"
            }
          }
        );

        if (
          response.data.files_details &&
          response.data.files_details.length > 0
        ) {
          const cid = response.data.files_details[0].cid;
          const url = `https://ipfs-chainsafe.dev/ipfs/${cid}`;
          console.log("Image uploaded to IPFS:", url);
          setError("");
          onCidChange(cid); // Passa o CID de volta para o componente pai
        }
      } catch (err) {
        setError(
          "Failed to upload image: " +
            (err.response?.data?.error || err.message)
        );
      }
    }
  };

  return (
    <>
      <label
        htmlFor="fileInput"
        style={{
          border: imagePreview ? "none" : "1px dashed #ddd",
          padding: imagePreview ? "0" : "20px",
          borderRadius: "10px",
          display: "flex", // Apenas um display definido aqui
          alignItems: "center",
          justifyContent: "center",
          height: "150px",
          cursor: "pointer"
        }}
      >
        {imagePreview ? (
          <Image
            src={imagePreview}
            rounded
            style={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
              borderRadius: "10px"
            }}
          />
        ) : (
          <IoCloudUploadOutline style={{ width: "50px", height: "50px" }} />
        )}
      </label>
      <input
        type="file"
        id="fileInput"
        onChange={handleImageChange}
        accept="image/*"
        style={{ display: "none" }}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
};

export default UploadImage;
