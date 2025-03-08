// Author: @yukiroow Harry Dominguez
/**
 * Logout Modal for when the logout button in the sidebar is clicked
 */
const LogoutModal = (props) => {
    return (
        <>
            <dialog id="logout_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-primary">Logout</h3>
                    <p className="py-4">Are you sure you want to logout?</p>
                    <div className="modal-action">
                        <button
                            className="btn btn-error text-white"
                            onClick={() => {
                                props.auth();
                            }}
                        >
                            Logout
                        </button>
                        <form method="dialog">
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default LogoutModal;
