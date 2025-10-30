import {
    ScheduleComponent,
    Week,
    TimelineViews,
    Month,
    TimelineMonth,
    Agenda,
    Inject,
    ViewsDirective,
    ViewDirective,
    ResourcesDirective,
    ResourceDirective,
} from "@syncfusion/ej2-react-schedule";
import { QuickInfoContentTemplate } from "./QuickInfoContentTemplate";
import {
    PopupOpenEventArgs,
    PopupCloseEventArgs,
    EventSettingsModel,
    QuickInfoTemplatesModel,
} from "@syncfusion/ej2-react-schedule";
import { customizeEditorTemplate } from "./customizeEditorTemplate";
import { CustomDataManager } from "./customDataManager";
import { AgendaEventTemplate, EventTemplate } from "./EventTemplate";

export default function Scheduler({ data }: { data: Record<string, any> }) {
    console.log("données dans Scheduler.tsx :", data.plagesHoraires);

    // Sélectionner seulement les données spécifiques nécessaires
    const dataManager = CustomDataManager.getInstance();

    const referenceData = dataManager.getReferenceData();

    const quickInfoTemplates: QuickInfoTemplatesModel = {
        content: (props: any) => {
            return QuickInfoContentTemplate(props);
        },
    };

    console.log("plagesHoraires dans Scheduler.tsx :", data.plagesHoraires);
    const eventSettings: EventSettingsModel = {
        dataSource: data.plagesHoraires || [],
    };

    const onPopupOpen = (args: PopupOpenEventArgs) => {
        if (args.type == "Editor") {
            const enrichedArgs = {
                ...args,
                comites: referenceData.comites,
                postes: referenceData.postes,
            };
            customizeEditorTemplate(enrichedArgs);
        }
    };
    const onPopupClose = (args: PopupCloseEventArgs) => {};

    const agendaEventTemplate = (props: any) => {
        return AgendaEventTemplate(props);
    };

    return (
        <ScheduleComponent
            width="100%"
            height="650px"
            eventSettings={eventSettings}
            enableAdaptiveUI={false}
            quickInfoTemplates={quickInfoTemplates}
            currentView="Month"
            selectedDate={new Date(2018, 5, 1)}
            popupOpen={onPopupOpen}
            popupClose={onPopupClose}
            rowAutoHeight={true}
        >
            <ViewsDirective>
                <ViewDirective
                    option="TimelineWeek"
                    timeScale={{ enable: false }}
                    group={{
                        byGroupID: true,
                        allowGroupEdit: true,
                        resources: ["Succursales", "Comités"],
                        idGroup: "ComiteID",
                    }}
                />
                <ViewDirective option="Week" />
                <ViewDirective option="Month" />
                <ViewDirective option="TimelineMonth" />

                <ViewDirective
                    option="Agenda"
                    eventTemplate={agendaEventTemplate}
                />
            </ViewsDirective>
            <ResourcesDirective>
                <ResourceDirective
                    field="SuccursaleID"
                    title="Succursale"
                    name="Succursales"
                    allowMultiple={false}
                    dataSource={data.succursales}
                    textField="Name"
                    idField="Id"
                />
                <ResourceDirective
                    field="ComiteID"
                    title="Comité"
                    name="Comités"
                    allowMultiple={false}
                    dataSource={data.comites}
                    groupIDField="SuccursaleID"
                    textField="Name"
                    idField="Id"
                />
                <ResourceDirective
                    field="PosteIDs"
                    title="Postes"
                    name="Postes"
                    allowMultiple={true}
                    dataSource={data.postes}
                    textField="Name"
                    idField="Id"
                />
            </ResourcesDirective>
            <Inject
                services={[Week, TimelineViews, Month, TimelineMonth, Agenda]}
            />
        </ScheduleComponent>
    );
}
