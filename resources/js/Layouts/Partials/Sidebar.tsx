import { Browser } from "@syncfusion/ej2-base";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import NavLink from "@/Components/NavLink";
import "./Sidebar.css";

export const Sidebar = () => {
    const isDevice: boolean = Browser.isDevice;

    return (
        <SidebarComponent
            id="portalSideBar"
            enableGestures={false}
            showBackdrop={isDevice}
            closeOnDocumentClick={isDevice}
        >
            <div className="dock">
                <div className="info align-center">
                    <div className="image"></div>
                    <div className="content nameContent">
                        <p className="name" style={{ marginTop: "16px" }}>
                            Jane Doe
                        </p>
                        <p className="user-type">Admin</p>
                    </div>
                </div>
                <a href={route("welcome")}>
                    <div
                        className={`sidebar-item dashboard ${
                            route().current("welcome") ? "active-item" : ""
                        }`}
                        id="dashboard"
                    >
                        <span className="dashboard-image">
                            <span className="icon-dashboard item-image"></span>
                        </span>
                        <span className="text" title="dashboard">
                            Tableau de bord
                        </span>
                    </div>
                </a>
                <a href={route("calendar")}>
                    <div
                        className={`sidebar-item dashboard ${
                            route().current("calendar") ? "active-item" : ""
                        }`}
                        id="calendar"
                    >
                        <span className="scheduler-image">
                            <span className="icon-schedule item-image"></span>
                        </span>
                        <span className="text" title="calendar">
                            Calendrier
                        </span>
                    </div>
                </a>
                <a href={route("volunteers")}>
                    <div
                        className={`sidebar-item dashboard ${
                            route().current("volunteers") ? "active-item" : ""
                        }`}
                        id="volunteers"
                    >
                        <span className="volunteers-image">
                            <span className="icon-volunteers item-image"></span>
                        </span>
                        <span className="text" title="volunteers">
                            Bénévoles
                        </span>
                    </div>
                </a>
                <div className="sidebar-item preference" id="preference">
                    <span className="preference-image">
                        <span className="icon-preference item-image"></span>
                    </span>
                    <span className="text" title="preference">
                        Préférences
                    </span>
                </div>
                <div className="sidebar-item about" id="about">
                    <span className="about-image">
                        <span className="icon-about item-image"></span>
                    </span>
                    <span className="text" title="about">
                        À propos
                    </span>
                </div>
            </div>
        </SidebarComponent>
    );
};
