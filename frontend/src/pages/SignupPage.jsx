// Author @yukiroow Harry Dominguez
import Logo from "../assets/logo.svg";
import BannerText from "../assets/banner-text.svg";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TermsModal from "../components/TermsModal";

/**
 * The signup page of the application.
 * The data sent is multipart/form
 */
const SignupPage = () => {
    const nav = useNavigate();
    const [userData, setUserData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        username: "",
        employment: "",
        location: "",
        email: "",
        company: "",
        batch: "",
        school: "",
        course: "",
        password: "",
        confirmPassword: "",
        displaypic: null,
    });
    const [schools, setSchools] = useState([]);
    const [courses, setCourses] = useState([]);

    const [inputError, setInputError] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        username: "",
        employment: "",
        location: "",
        email: "",
        company: "",
        batch: "",
        school: "",
        course: "",
        password: "",
        confirmPassword: "",
        displaypic: "",
        agreeToTerms: "",
    });

    const [agree, setAgree] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchDropdown = async () => {
            await axios
                .get("http://localhost:2012/auth/schools")
                .then((res) => {
                    setSchools(res.data.schools);
                });
            await axios
                .get("http://localhost:2012/auth/courses")
                .then((res) => {
                    setCourses(res.data.courses);
                });
        };
        fetchDropdown();
    }, []);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError("");
            }, 2000);
            return () => clearTimeout(timer);
        }
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(false);
                nav("/");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    const handleFormInput = (event) => {
        const { name, value } = event.target;
        setUserData((values) => ({ ...values, [name]: value }));
    };

    const handleDropdownClick = () => {
        const menu = document.activeElement;
        if (menu) {
            menu.blur();
        }
    };

    const handleDropdownInput = (name, value) => {
        setUserData((values) => ({ ...values, [name]: value }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

        if (!file) return;

        if (!allowedTypes.includes(file.type)) {
            setInputError((values) => ({
                ...values,
                displaypic: "Only JPG, JPEG, and PNG files are allowed.",
            }));
            setUserData((values) => ({ ...values, displaypic: null }));
            event.target.files;
            return;
        }

        if (file && file.size > 5_242_880) {
            setInputError((values) => ({
                ...values,
                displaypic: "Profile Picture must not exceed 5 MB.",
            }));
            setUserData((values) => ({ ...values, displaypic: null }));
        } else {
            setError(false);
            setInputError((values) => ({
                ...values,
                displaypic: "",
            }));
            setUserData((values) => ({ ...values, displaypic: file }));
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let errors = 0;
        setInputError({
            firstName: "",
            middleName: "",
            lastName: "",
            username: "",
            employment: "",
            location: "",
            email: "",
            company: "",
            batch: "",
            school: "",
            course: "",
            password: "",
            confirmPassword: "",
            displaypic: "",
        });

        setUserData((values) => ({
            ...values,
            firstName: userData.firstName.trim().replace(/\s\s+/g, " "),
            middleName: userData.middleName.trim().replace(/\s\s+/g, " "),
            lastName: userData.lastName.trim().replace(/\s\s+/g, " "),
            company: userData.company.trim().replace(/\s\s+/g, " "),
        }));

        if (!userData.firstName) {
            errors++;
            setInputError((values) => ({
                ...values,
                firstName: "Please enter your first name!",
            }));
        }
        if (!userData.lastName) {
            errors++;
            setInputError((values) => ({
                ...values,
                lastName: "Please enter your last name!",
            }));
        }
        if (!userData.username) {
            errors++;
            setInputError((values) => ({
                ...values,
                username: "Please enter your desired username!",
            }));
        }
        if (!userData.email) {
            errors++;
            setInputError((values) => ({
                ...values,
                email: "Please enter your email address!",
            }));
        }
        if (userData.email && !/\S+@\S+\.\S+/.test(userData.email)) {
            errors++;
            setInputError((values) => ({
                ...values,
                email: "Please enter a valid email",
            }));
        }
        if (!userData.batch) {
            errors++;
            setInputError((values) => ({
                ...values,
                batch: "Please enter your batch year!",
            }));
        }
        if (!userData.school) {
            errors++;
            setInputError((values) => ({
                ...values,
                school: "Please enter your school acronym!",
            }));
        }
        if (!userData.course) {
            errors++;
            setInputError((values) => ({
                ...values,
                course: "Please enter your graduated course!",
            }));
        }
        if (!userData.password) {
            errors++;
            setInputError((values) => ({
                ...values,
                password: "Please enter your desired password!",
            }));
        }
        if (
            userData.password &&
            /^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$/.test(
                userData.password
            )
        ) {
            errors++;
            setInputError((values) => ({
                ...values,
                password:
                    "Password must be at least 8 characters, have a digit, a special, upper-case, and lower-case character.",
            }));
        }
        if (!userData.confirmPassword) {
            errors++;
            setInputError((values) => ({
                ...values,
                confirmPassword: "Please re-enter your desired password!",
            }));
        }
        if (userData.password !== userData.confirmPassword) {
            errors++;
            setInputError((values) => ({
                ...values,
                confirmPassword: "Passwords do not match!",
            }));
        }

        if (!agree) {
            errors++;
            setInputError((values) => ({
                ...values,
                agreeToTerms: "Required",
            }));
        }

        if (errors > 0) {
            setError("Please fix all the errors first!");
        } else {
            const formData = new FormData();
            Object.entries(userData).forEach(([key, value]) => {
                formData.append(key, value);
            });
            const signup = async () => {
                await axios
                    .post("http://localhost:2012/auth/signup", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    })
                    .then(() => {
                        setSuccess(true);
                    })
                    .catch((err) => {
                        if (err.status) {
                            setError("Username already taken!");
                        }
                    });
            };

            signup();
        }
    };

    return (
        <>
            {error && <ErrorAlert msg={error} />}
            {success && <SuccessAlert />}
            <main className="flex flex-row h-screen bg-primary">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col flex-1 mx-auto pt-10 px-6 items-center rounded-tr-box rounded-br-box bg-base-100"
                    autoComplete="new-off"
                >
                    <Banner />
                    <div className="flex flex-row gap-5 justify-center w-10/12">
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">First Name*</span>
                            </div>
                            <input
                                type="text"
                                placeholder="Enter your first name"
                                name="firstName"
                                className="input input-bordered w-full max-w-xs"
                                value={userData["firstName"]}
                                onChange={(e) => {
                                    if (!/^[A-Za-z\s]*$/.test(e.target.value))
                                        return;
                                    if (e.target.value.length > 50) return;
                                    handleFormInput(e);
                                }}
                            />
                            {inputError.firstName && (
                                <span className="label-text text-error italic">
                                    {inputError.firstName}
                                </span>
                            )}
                        </label>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Middle Name</span>
                            </div>
                            <input
                                type="text"
                                placeholder="Enter your middle name"
                                name="middleName"
                                className="input input-bordered w-full max-w-xs"
                                value={userData["middleName"]}
                                onChange={(e) => {
                                    if (!/^[A-Za-z\s]*$/.test(e.target.value))
                                        return;
                                    if (e.target.value.length > 40) return;
                                    handleFormInput(e);
                                }}
                            />
                        </label>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Last Name*</span>
                            </div>
                            <input
                                type="text"
                                placeholder="Enter your last name"
                                name="lastName"
                                className="input input-bordered w-full max-w-xs"
                                value={userData["lastName"]}
                                onChange={(e) => {
                                    if (!/^[A-Za-z\s]*$/.test(e.target.value))
                                        return;
                                    if (e.target.value.length > 40) return;
                                    handleFormInput(e);
                                }}
                            />
                            {inputError.lastName && (
                                <span className="label-text text-error italic">
                                    {inputError.lastName}
                                </span>
                            )}
                        </label>
                    </div>
                    <div className="flex flex-row gap-5 justify-center w-10/12">
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Username*</span>
                            </div>
                            <input
                                type="text"
                                placeholder="Enter your desired username"
                                name="username"
                                className="input input-bordered w-full max-w-xs"
                                value={userData["username"]}
                                onChange={(e) => {
                                    e.target.value = e.target.value.replace(
                                        /\s/g,
                                        ""
                                    );
                                    if (e.target.value.length > 25) return;
                                    handleFormInput(e);
                                }}
                                autoComplete="new-password"
                            />
                            {inputError.username && (
                                <span className="label-text text-error italic">
                                    {inputError.username}
                                </span>
                            )}
                        </label>
                        <label className="form-control w-[41.25rem]">
                            <div className="label">
                                <span className="label-text">Email*</span>
                            </div>
                            <input
                                type="text"
                                name="email"
                                placeholder="Enter your email address"
                                className="input input-bordered w-full"
                                value={userData["email"]}
                                onChange={(e) => {
                                    e.target.value = e.target.value.replace(
                                        /\s/g,
                                        ""
                                    );
                                    if (e.target.value.length > 50) return;
                                    handleFormInput(e);
                                }}
                            />
                            {inputError.email && (
                                <span className="label-text text-error italic">
                                    {inputError.email}
                                </span>
                            )}
                        </label>
                    </div>
                    <div className="flex flex-row gap-5 justify-center w-10/12">
                        <div className="dropdown w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Employment</span>
                            </div>
                            <div
                                tabIndex={0}
                                role="button"
                                className="select w-full"
                            >
                                {userData["employment"] || "Select"}
                            </div>
                            <ul
                                tabIndex={0}
                                name="employment"
                                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                            >
                                <li
                                    onClick={() => {
                                        handleDropdownClick();
                                        setUserData((values) => ({
                                            ...values,
                                            ["employment"]: "Employed",
                                        }));
                                    }}
                                >
                                    <a>Employed</a>
                                </li>
                                <li
                                    onClick={() => {
                                        handleDropdownClick();
                                        setUserData((values) => ({
                                            ...values,
                                            ["employment"]: "Underemployed",
                                        }));
                                    }}
                                >
                                    <a>Underemployed</a>
                                </li>
                                <li
                                    onClick={() => {
                                        handleDropdownClick();
                                        setUserData((values) => ({
                                            ...values,
                                            ["employment"]: "Unemployed",
                                        }));
                                    }}
                                >
                                    <a>Unemployed</a>
                                </li>
                                <li
                                    onClick={() => {
                                        handleDropdownClick();
                                        setUserData((values) => ({
                                            ...values,
                                            ["employment"]: "Retired",
                                        }));
                                    }}
                                >
                                    <a>Retired</a>
                                </li>
                            </ul>
                            {inputError.employment && (
                                <span className="label-text text-error italic">
                                    {inputError.employment}
                                </span>
                            )}
                        </div>
                        <div className="dropdown w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Location</span>
                            </div>
                            <div
                                tabIndex={0}
                                role="button"
                                className="select w-full"
                            >
                                {userData["location"] || "Select"}
                            </div>
                            <ul
                                tabIndex={0}
                                name="location"
                                className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                            >
                                <li
                                    onClick={() => {
                                        handleDropdownClick();
                                        setUserData((values) => ({
                                            ...values,
                                            ["location"]: "Domestic",
                                        }));
                                    }}
                                >
                                    <a>Domestic</a>
                                </li>
                                <li
                                    onClick={() => {
                                        handleDropdownClick();
                                        setUserData((values) => ({
                                            ...values,
                                            ["location"]: "Foreign",
                                        }));
                                    }}
                                >
                                    <a>Foreign</a>
                                </li>
                            </ul>
                            {inputError.location && (
                                <span className="label-text text-error italic">
                                    {inputError.location}
                                </span>
                            )}
                        </div>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Company Name</span>
                            </div>
                            <input
                                type="text"
                                name="company"
                                placeholder="Enter your company name"
                                className="input input-bordered w-full max-w-xs"
                                value={userData["company"]}
                                onChange={(e) => {
                                    if (e.target.value.length > 30) return;
                                    handleFormInput(e);
                                }}
                            />
                            {inputError.company && (
                                <span className="label-text text-error italic">
                                    {inputError.company}
                                </span>
                            )}
                        </label>
                    </div>
                    <div className="flex flex-row gap-5 justify-center w-10/12"></div>
                    <div className="flex flex-row gap-5 justify-center w-10/12">
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Batch*</span>
                            </div>
                            <input
                                type="text"
                                name="batch"
                                placeholder="Enter your batch year (2010, 2011, etc.)"
                                className="input input-bordered w-full max-w-xs"
                                value={userData["batch"]}
                                onChange={(e) => {
                                    e.target.value = e.target.value.replace(
                                        /\s/g,
                                        ""
                                    );
                                    if (e.target.value.length > 4) return;
                                    handleFormInput(e);
                                }}
                            />
                            {inputError.batch && (
                                <span className="label-text text-error italic">
                                    {inputError.batch}
                                </span>
                            )}
                        </label>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">School*</span>
                            </div>
                            <select
                                name="school"
                                className="w-full max-w-xs select"
                                defaultValue="School"
                            >
                                <option disabled={true}>School</option>
                                {schools.map((value) => (
                                    <option
                                        key={value}
                                        onClick={() =>
                                            handleDropdownInput('school', value)
                                        }
                                    >
                                        {value}
                                    </option>
                                ))}
                            </select>
                            {inputError.school && (
                                <span className="label-text text-error italic">
                                    {inputError.school}
                                </span>
                            )}
                        </label>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Course*</span>
                            </div>
                            <select
                                name="school"
                                className="w-full max-w-xs select"
                                defaultValue="Course"
                            >
                                <option disabled={true}>Course</option>
                                {courses.map((value) => (
                                    <option
                                        key={value}
                                        onClick={() =>
                                            handleDropdownInput('course', value)
                                        }
                                    >
                                        {value}
                                    </option>
                                ))}
                            </select>
                            {inputError.course && (
                                <span className="label-text text-error italic">
                                    {inputError.course}
                                </span>
                            )}
                        </label>
                    </div>
                    <div className="flex flex-row gap-5 justify-center w-10/12">
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">
                                    Upload Profile Picture (png, jpg, jpeg)
                                </span>
                            </div>
                            <input
                                type="file"
                                name="displaypic"
                                className="file-input file-input-primary w-full"
                                onChange={handleFileChange}
                                accept="image/jpeg,image/png,image/jpg"
                            />
                            {inputError.displaypic && (
                                <span className="label-text text-error italic">
                                    {inputError.displaypic}
                                </span>
                            )}
                        </label>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">Password*</span>
                            </div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your desired password"
                                className="input input-bordered w-full max-w-xs"
                                value={userData["password"]}
                                onChange={(e) => {
                                    e.target.value = e.target.value.replace(
                                        /\s/g,
                                        ""
                                    );
                                    if (e.target.value.length > 512) return;
                                    handleFormInput(e);
                                }}
                                autoComplete="new-password"
                            />
                            {inputError.password && (
                                <span className="label-text text-error italic">
                                    {inputError.password}
                                </span>
                            )}
                        </label>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">
                                    Confirm Password*
                                </span>
                            </div>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Re-enter your desired password"
                                className="input input-bordered w-full max-w-xs"
                                value={userData["confirmPassword"]}
                                onChange={(e) => {
                                    e.target.value = e.target.value.replace(
                                        /\s/g,
                                        ""
                                    );
                                    if (e.target.value.length > 64) return;
                                    handleFormInput(e);
                                }}
                                autoComplete="new-password"
                            />
                            {inputError.confirmPassword && (
                                <span className="label-text text-error italic">
                                    {inputError.confirmPassword}
                                </span>
                            )}
                        </label>
                    </div>
                    <TermsModal />
                    <div className="flex flex-row gap-5 justify-center w-10/12 mt-5">
                        <input
                            type="checkbox"
                            className="checkbox checkbox-secondary hover:opacity-80"
                            onClick={() => {
                                setAgree((prev) => !prev);
                            }}
                        />
                        <span className="label-text mr-10">
                            I have read and agree to the{" "}
                            <span
                                className="underline cursor-pointer hover:text-secondary"
                                onClick={() =>
                                    document
                                        .getElementById("terms_modal")
                                        .showModal()
                                }
                            >
                                Terms and Conditions and Privacy Policy
                            </span>{" "}
                            *
                        </span>
                        {inputError.agreeToTerms && (
                            <span className="label-text text-error italic">
                                {inputError.agreeToTerms}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-row gap-5 justify-center items-center w-10/12 mt-10">
                        <input
                            type="submit"
                            className="btn btn-wide block btn-primary"
                            value="Signup"
                        />
                    </div>
                </form>
                <aside className="flex basis-1/3 flex-col mx-auto items-center px-20">
                    <h1 className="text-3xl font-bold text-center mt-96 text-primary-content">
                        ALREADY HAVE AN ACCOUNT?
                    </h1>
                    <p className="text-xl font-thin text-center text-primary-content">
                        Login to your account
                    </p>
                    <button
                        onClick={() => nav("/")}
                        className="btn btn-wide mt-6"
                    >
                        Login
                    </button>
                </aside>
            </main>
        </>
    );
};

const Banner = () => {
    return (
        <>
            <div className="flex flex-row self-center">
                <img src={Logo} alt="Alumania Logo" className="w-36" />
                <img
                    src={BannerText}
                    alt="Alumania Text name"
                    className="w-80"
                />
            </div>
        </>
    );
};

const ErrorAlert = ({ msg }) => {
    return (
        <>
            <div
                role="alert"
                className="alert alert-error absolute w-auto top-2 left-2 fade-in-out"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span>{msg}</span>
            </div>
        </>
    );
};

const SuccessAlert = () => {
    return (
        <>
            <div
                role="alert"
                className="alert alert-info absolute w-auto top-2 left-2 fade-in-out"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <span>
                    Signup Successful! Please wait for our email while we verify
                    your account!
                </span>
            </div>
        </>
    );
};

export default SignupPage;
