// Author @yukiroow Harry Dominguez
import axios from "axios";
import { useEffect, useState } from "react";
import ErrorHero from "../components/ErrorHero";
import EventCard from "../components/event/EventCard";

/**
 * The events page containing all the events from the database.
 * Events are rendered 10 items at a time for performance reasons.
 */
const EventsPage = () => {
    const [events, setEvents] = useState([]);
    const [interested, setInterested] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const userId = localStorage.getItem("userid").replace(/['"]+/g, "");

    const fetchEvents = async (page) => {
        try {
            const res = await axios.get(
                `http://localhost:2012/events/${userId}?page=${page}&limit=10`
            );

            const interestedRes = await axios.get(
                `http://localhost:2012/events/interestedinevents/${userId}`
            );
            setEvents((prevEvents) => {
                const newEvents = res.data.filter(
                    (event) =>
                        !prevEvents.some((e) => e.eventid === event.eventid)
                );
                return [...prevEvents, ...newEvents];
            });
            setInterested(interestedRes.data);

            setHasMore(res.data.length === 10);
        } catch (_) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleScroll = () => {
        const bottom =
            window.innerHeight + document.documentElement.scrollTop ===
            document.documentElement.offsetHeight;
        if (bottom && hasMore && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        fetchEvents(page);
    }, [page]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [loading, hasMore]);

    if (loading && page === 1) {
        return (
            <div className="w-full h-[calc(100vh-6rem)] flex align-middle justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <>
                <ErrorHero />
            </>
        );
    }

    if (!events.length) {
        return (
            <>
                <div className="w-1/2 min-w-96 m-auto mt-[30vh] opacity-50 select-none">
                    <h1 className="ml-[20%] text-5xl font-thin">
                        There&apos;s nothing here yet.
                    </h1>
                    <p className="ml-[21%] text-2xl font-extralight">
                        You&apos;ll see posted events here :)
                    </p>
                </div>
            </>
        );
    }

    return (
        <>
            <main className="flex w-full justify-center mb-5">
                <div className="w-[50%] rounded-2xl border border-t-0 border-gray-200 overflow-hidden">
                    <section className="join join-vertical rounded-box">
                        {events.map((event) => {
                            const isInterested = interested.some(
                                (interest) =>
                                    interest.eventid === event.eventid &&
                                    interest.userid === userId
                            );
                            return (
                                <EventCard
                                    key={event.eventid}
                                    event={event}
                                    interested={isInterested}
                                />
                            );
                        })}
                    </section>
                </div>
            </main>
        </>
    );
};

export default EventsPage;
