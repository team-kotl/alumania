// Author: @PEEACHYBEE Freskkie Encarnacion
//         @yukiroow Harry Dominguez
/**
 * Oppurtunity Card for the list of all the jobs
 */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faLocationDot } from "@fortawesome/free-solid-svg-icons";

const OpportunityCard = ({
    job,
    handleCardClick,
    isSelected,
    calculateTimeAgo,
}) => {
    return (
        <div
            id={job.jobpid}
            className={`card-body cursor-pointer join-item max-h-52 border-t first:border-t-0 border-gray-200 hover:bg-slate-100 ${
                isSelected ? "bg-slate-100" : "bg-white"
            }`}
            onClick={() => handleCardClick(job)}
        >
            <div className="flex items-center justify-between">
                <h2 className="card-title text-2xl text-primary font-bold line-clamp-1">
                    {job.title}
                </h2>
                <div className="relative flex justify-center items-center w-20 h-5 bg-primary rounded-r-full rounded-l-full">
                    <p className="absolute text-primary-content text-xs font-semibold">
                        {job.type}
                    </p>
                </div>
            </div>
            <p className="text-sm text-gray-500">
                {calculateTimeAgo(job.publishtimestamp)}
            </p>
            <div className="flex items-center space-x-1 font-semibold text-gray-500 mt-2">
                <div className="flex-1">
                    <FontAwesomeIcon
                        icon={faBuilding}
                        className="h-5 w-5 text-gray-500 mr-2"
                    />
                    <p className="inline-block">{job.companyname}</p>
                </div>
                <div className="flex-1">
                    <FontAwesomeIcon
                        icon={faLocationDot}
                        className="h-5 w-5 text-gray-500 mr-2"
                    />
                    <p className="inline-block">{job.location}</p>
                </div>
            </div>
            <p className="text-primary line-clamp-1">{job.description}</p>
        </div>
    );
};

export default OpportunityCard;
