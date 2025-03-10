// Author: @PEEACHYBEE Freskkie Encarnacion
//         @yukiroow Harry Dominguez
import { PiBuilding, PiMapPinArea } from "react-icons/pi";
import { useState } from "react";
import JobModal from "./JobModal";
/**
 * JobSearchCard component displays a job card with details such as job title, type, company name,
 * location, and description. It also calculates how long ago the job was posted and allows the user
 * to open a modal for more detailed job information.
 */
const JobSearchCard = ({ job }) => {
    const [showModal, setShowModal] = useState(false);

    const handleJobClick = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const calculateTimeAgo = (timestamp) => {
        const now = new Date();
        const publishedDate = new Date(timestamp);
        const diffInSeconds = Math.floor((now - publishedDate) / 1000);

        const secondsInMinute = 60;
        const secondsInHour = 3600;
        const secondsInDay = 86400;
        const secondsInWeek = 604800;

        if (diffInSeconds < secondsInHour) {
            const minutes = Math.floor(diffInSeconds / secondsInMinute);
            return `Posted ${
                minutes <= 1 ? "1 minute" : `${minutes} minutes`
            } ago`;
        } else if (diffInSeconds < secondsInDay) {
            const hours = Math.floor(diffInSeconds / secondsInHour);
            return `Posted ${hours <= 1 ? "1 hour" : `${hours} hours`} ago`;
        } else if (diffInSeconds < secondsInWeek) {
            const days = Math.floor(diffInSeconds / secondsInDay);
            return `Posted ${days <= 1 ? "1 day" : `${days} days`} ago`;
        } else {
            const weeks = Math.floor(diffInSeconds / secondsInWeek);
            return `Posted ${weeks <= 1 ? "1 week" : `${weeks} weeks`} ago`;
        }
    };

    return (
        <>
            {showModal && (
                <JobModal
                    job={job}
                    calculateTimeAgo={calculateTimeAgo}
                    onClose={closeModal}
                />
            )}
            <div
                className="join-item justify-self-center bg-white p-10 first:rounded-t-2xl last:rounded-b-2xl border-x border-t last:border-b border-gray-200 cursor-pointer"
                onClick={handleJobClick}
            >
                <div className="flex items-center gap-5">
                    <h2 className="card-title text-secondary font-bold">
                        {job.title}
                    </h2>
                    <div className="relative flex justify-center items-center w-20 h-5 bg-accent rounded-full">
                        <p className="absolute text-text text-xs font-semibold">
                            {job.type}
                        </p>
                    </div>
                </div>
                <p className="text-sm text-gray-500">
                    {calculateTimeAgo(job.publishtimestamp)}
                </p>
                <div className="flex items-center space-x-2 font-semibold text-gray-700 mt-2">
                    <PiBuilding className="h-5 w-5 text-primary" />
                    <p>{job.companyname}</p>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                    <PiMapPinArea className="h-5 w-5" />
                    <p>{job.location}</p>
                </div>
                <p className="mt-4 ml-7 text-primary whitespace-pre-line line-clamp-3">
                    {job.description}
                </p>
            </div>
        </>
    );
};

export default JobSearchCard;
