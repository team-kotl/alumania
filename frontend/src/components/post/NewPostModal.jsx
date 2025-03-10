// Author: @hiimjude Jude Angelo Ilumin
//         @yukiroow Harry Dominguez
import { useState } from "react";
import { PiImagesLight } from "react-icons/pi";
import ExperienceImageUpload from "./ExperienceImageUpload";
import axios from "axios";

/**
 * A modal component for creating and submitting new posts with text and image uploads.
 */
const NewPostModal = ({ handleAddPost }) => {
    const username = localStorage.getItem("user");
    const id = localStorage.getItem("userid");
    const dpRaw = JSON.parse(localStorage.getItem("userdp"));
    const [chars, setChars] = useState(0);
    const [postDetails, setPostDetails] = useState({
        content: "",
        images: [],
        albumid: "",
    });
    const [errorMessage, setErrorMessage] = useState("");

    /**
     * Updates the post content and adjusts the textarea height dynamically.
     */
    const updateModal = (event) => {
        const content = event.target.value;
        setPostDetails((prev) => ({ ...prev, ["content"]: content }));
        setChars(content.length);
        const textarea = event.target;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    /**
     * Opens the image upload modal.
     */
    const handleImageClick = (event) => {
        event.preventDefault();
        document.getElementById("uploadimage_modal").showModal();
    };

    /**
     * Handles new image uploads and updates the post details.
     */
    const handleImageUpload = (newImages) => {
        setPostDetails((prev) => ({
            ...prev,
            images: [...prev.images, ...newImages],
        }));
    };

    /**
     * Submits the post content and images to the server.
     */
    const submitHandler = async (event) => {
        event.preventDefault();
        setErrorMessage("");

        if (postDetails.content === "" && postDetails.images.length < 1) {
            setErrorMessage("Please enter some text or add photos");
            return;
        }

        const formData = new FormData();

        formData.append("userid", id.substring(1, id.length - 1));
        formData.append("content", postDetails.content);
        formData.append("albumid", postDetails.albumid);

        postDetails.images.forEach((image) => {
            formData.append("images", image);
        });

        try {
            const response = await axios.post(
                "http://localhost:2012/experiences/new",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                alert("Post successfully uploaded!");
                setPostDetails({ content: "", images: [], albumid: "" });
                setChars(0);
                handleAddPost();
                document.getElementById("addpost_modal").close();
                window.location.reload();
            }
        } catch (error) {
            alert("Failed to upload post. Please try again.");
        }
    };

    /**
     * Generates the user's profile picture or a placeholder avatar.
     */
    const dpImage =
        dpRaw !== null
            ? dpRaw.data.length > 0
                ? `data:${dpRaw.data.mimetype};base64,${btoa(
                      new Uint8Array(dpRaw.data).reduce(
                          (data, byte) => data + String.fromCharCode(byte),
                          ""
                      )
                  )}`
                : null
            : null;
    const avatar = dpImage ? (
        <div className="avatar justify-center">
            <div
                className="ring-primary ring-offset-base-100 w-12 h-12 rounded-full ring ring-offset-2"
                onClick={() =>
                    document.getElementById("uploadpfp_modal").showModal()
                }
            >
                <img src={dpImage}/>
            </div>
        </div>
    ) : (
        <div className="avatar placeholder">
            <div
                className="bg-primary text-neutral-content w-12 h-12 rounded-full ring ring-offset-2 ring-primary ring-offset-base-100"
                onClick={() =>
                    document.getElementById("uploadpfp_modal").showModal()
                }
            >
                <p className="text-xl cursor-default select-none">
                    {username.substring(1, 2).toUpperCase()}
                </p>
            </div>
        </div>
    );

    return (
        <>
            <ExperienceImageUpload onImageUpload={handleImageUpload} />
            <dialog id="addpost_modal" className="modal">
                <div className="modal-box w-11/12 max-w-2xl">
                    <form method="dialog">
                        <button
                            className="btn btn-sm text-gray-400 btn-link absolute right-2 top-6 no-underline hover:underline focus:outline-none focus:border-none"
                            onClick={() => {
                                setPostDetails({
                                    content: "",
                                    images: [],
                                    albumid: "",
                                });
                                handleAddPost();
                            }}
                        >
                            Cancel
                        </button>
                    </form>
                    <h3 className="text-lg text-primary text-center border-b border-gray-400 py-2 mb-4 cursor-default select-none">
                        Create Experience
                    </h3>
                    <div className="flex flex-row gap-5 align-middle">
                        {avatar}
                        <div className="w-full">
                            <p className="text-primary font-semibold cursor-default select-none">
                                {username.substring(1, username.length - 1)}
                            </p>
                            <form onSubmit={submitHandler}>
                                <textarea
                                    className="textarea textarea-ghost w-full p-0 focus:border-none focus:outline-none"
                                    placeholder="Share your experience"
                                    value={postDetails.content}
                                    onInput={(e) => {
                                        if (e.target.value.length > 280) return;
                                        updateModal(e);
                                    }}
                                ></textarea>
                                <p
                                    className={`text-end text-sm cursor-default select-none
                                    ${
                                        chars === 280
                                            ? "text-error font-semibold"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {chars}/280
                                </p>
                                <div className="flex flex-row items-center gap-3">
                                    <button
                                        className="btn btn-xs btn-outline btn-primary"
                                        onClick={handleImageClick}
                                    >
                                        <PiImagesLight />
                                        Add Photos
                                    </button>
                                    <span className="text-gray-400 text-xs">
                                        {postDetails.images.length} uploaded
                                    </span>
                                </div>
                                <div className="flex flex-row justify-end rounded-full items-center">
                                    <span className="w-full text-left text-xs text-error italic">
                                        {errorMessage}
                                    </span>
                                    <button
                                        className="btn btn-primary btn-sm w-[5rem] rounded-full transition-all hover:scale-105"
                                        type="submit"
                                    >
                                        Post
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default NewPostModal;
