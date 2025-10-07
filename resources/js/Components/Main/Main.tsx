import { Browser } from "@syncfusion/ej2-base";
import { SidebarComponent } from "@syncfusion/ej2-react-navigations";
import "./Main.css";
import { Provider } from "react-redux";
import Scheduler from "@/Components/Scheduler/Scheduler";
import { store } from "@/app/store";
import { useRef } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Dashboard } from "../Dashboard/Dashboard";
import { Volunteers } from "../Volunteers/Volunteers";

export const Main = () => {
    const sideBar = useRef<SidebarComponent>(null);
    const isDevice: boolean = Browser.isDevice;
    const navigate = useNavigate();

    const onItemClick = (args: Event): void => {
        if (isDevice) {
            sideBar.current?.hide();
        }
        if (args.currentTarget) {
            navigate("/" + (args.currentTarget as HTMLElement).id);
        }
        const elements: HTMLElement[] = [].slice.call(
            (args.currentTarget as HTMLElement).parentElement.querySelectorAll(
                ".active-item"
            )
        );
        elements.forEach((element) => {
            if (element.classList.contains("active-item")) {
                element.classList.remove("active-item");
            }
        });
        (args.currentTarget as HTMLElement).classList.add("active-item");
    };
    return (
        <div className="portal-wrapper">
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
                    <div
                        className="sidebar-item dashboard"
                        id="dashboard"
                        onClick={onItemClick.bind(this)}
                    >
                        <span className="dashboard-image">
                            <span className="icon-dashboard item-image"></span>
                        </span>
                        <span className="text" title="dashboard">
                            Tableau de bord
                        </span>
                    </div>
                    <div
                        className="sidebar-item calendar"
                        id="calendar"
                        onClick={onItemClick.bind(this)}
                    >
                        <span className="scheduler-image">
                            <span className="icon-schedule item-image"></span>
                        </span>
                        <span className="text" title="calendar">
                            Calendrier
                        </span>
                    </div>
                    <div
                        className="sidebar-item volunteers"
                        id="volunteers"
                        onClick={onItemClick.bind(this)}
                    >
                        <span className="volunteers-image">
                            <span className="icon-volunteers item-image"></span>
                        </span>
                        <span className="text" title="volunteers">
                            Bénévoles
                        </span>
                    </div>
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
            <main className=" main-content e-content-animation">
                <div className="main-wrapper px-5 py-3">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route
                            path="/calendar"
                            element={
                                <Provider store={store}>
                                    <Scheduler />
                                </Provider>
                            }
                        />
                        <Route path="/volunteers" element={<Volunteers />} />
                    </Routes>
                </div>
            </main>
        </div>
    );
};
