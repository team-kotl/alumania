// Author @yukiroow Harry Dominguez
import axios from "axios";
import { useEffect, useState } from "react";
import ErrorHero from "../components/ErrorHero";
import OpportunityCard from "../components/opportunity/OpportunityCard";
import OpportunityPane from "../components/opportunity/OpportunityPane";
import { PiBriefcaseThin } from "react-icons/pi";

/**
 * The events page containing all the jobs from the database.
 * This page is divided into two sections: The Cards Section and the Display Pane.
 * The Cards Section contains all the Opportunity Cards and the Display Pane
 * displays the information of the opportunity card that has been selected.
 */
const JobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [interested, setInterested] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem("userid").replace(/['"]+/g, "");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get("http://localhost:2012/jobposts");
                const resInterested = await axios.get(
                    `http://localhost:2012/jobposts/interestedjobs/${userId}`
                );
                setJobs(res.data);
                setInterested(
                    resInterested.data === "nothing" ? [] : resInterested.data
                );
            } catch (error) {
                console.log(error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const handleCardClick = (job) => {
        const isInterested = interested.some(
            (interest) => interest.jobpid === job.jobpid
        );
        setSelectedJob({ ...job, isInterested });
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

    if (loading) {
        return (
            <>
                <div className="w-full h-[calc(100vh-6rem)] flex align-middle justify-center">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <ErrorHero />
            </>
        );
    }

    if (!jobs.length) {
        return (
            <>
                <div className="w-1/2 min-w-96 m-auto mt-[30vh] opacity-50 select-none">
                    <h1 className="ml-[20%] text-5xl font-thin">
                        There&apos;s nothing here yet.
                    </h1>
                    <p className="ml-[21%] text-2xl font-extralight">
                        You&apos;ll see job listings here :)
                    </p>
                </div>
            </>
        );
    }

    return (
        <>
            <main className="flex h-[calc(100vh-7rem)]">
                <section className="join join-vertical w-[40%] rounded-2xl overflow-y-auto ml-16 border border-gray-200">
                    {jobs.map((job) => (
                        <OpportunityCard
                            key={job.jobpid}
                            job={job}
                            handleCardClick={handleCardClick}
                            isSelected={selectedJob?.jobpid === job.jobpid}
                            calculateTimeAgo={calculateTimeAgo}
                        />
                    ))}
                </section>
                {!selectedJob ? (
                    <div className="relative h-full overflow-hidden">
                        <div className="card bg-white border border-gray-200 w-[50%] h-[calc(100vh-7rem)] fixed top-24 right-10 overflow-y-auto p-4">
                            <div className="card-body">
                                <PiBriefcaseThin
                                    size="30"
                                    className="opacity-40 mt-[25%]"
                                    color="#032543"
                                />
                                <h1 className="text-primary text-center opacity-40 font-thin text-2xl cursor-default select-none">
                                    Select an Opportunity
                                </h1>
                            </div>
                        </div>
                    </div>
                ) : (
                    <OpportunityPane
                        job={selectedJob}
                        interested={interested}
                        setInterested={setInterested}
                        calculateTimeAgo={calculateTimeAgo}
                    />
                )}
            </main>
        </>
    );
};

export default JobsPage;
