import { ButtonComponent } from "@syncfusion/ej2-react-buttons"
import { ColumnDirective, ColumnsDirective, GridComponent, Inject } from "@syncfusion/ej2-react-grids"
import { useRef } from "react";

export const Volunteers = () => {
  const gridObj = useRef<GridComponent>(null);
  const volunteerList = [
        { id: '1', name: 'Julie Bergeron', email: 'julie@email.com', isAvailable: true, lastActivity: '2h' },
        { id: '2', name: 'David Pelletier', email: 'david@email.com', isAvailable: true, lastActivity: '1j' },
        { id: '3', name: 'Isabelle Roy', email: 'isabelle@email.com', isAvailable: false, lastActivity: '3j' },
        { id: '4', name: 'François Gagnon', email: 'francois@email.com', isAvailable: true, lastActivity: '5h' },
    ];
    
  const dialogTemplate = (): JSX.Element => {
    return (
      <div className='grid-edit-dialog'>
        <div className='field-row'>
          <label> Patient Id </label><span id='Id'></span>
        </div>
        <div className='field-row'>
          <label> Patient Name </label><span id='Name'></span>
        </div>
        <div className='field-row'>
          <label> Gender </label><span id='Gender'></span>
        </div>
        <div className='field-row'>
          <label> DOB </label><span id='DOB'></span>
        </div>
        <div className='field-row'>
          <label> Blood Group </label><span id='BloodGroup'></span>
        </div>
        <div className='field-row'>
          <label> Mobile Number </label><span id='Mobile'></span>
        </div>
        <div className='field-row'>
          <label> Email </label><span id='Email'></span>
        </div>
        <div className='field-row'>
          <label> Symptoms </label><span id='Symptoms'></span>
        </div>
        <div className='field-row history-row'>
          <label>Appointment History</label>
          <div id='history-wrapper'>
            
          </div>
        </div>
      </div>
    );
  }
    return(
        <>
      <div id='volunteer-wrapper' className="portal-volunteer-wrapper">
        <header>
          <div className="module-title">
            <div className='title'>Liste de Bénévoles</div>
            <div className='underline'></div>
          </div>
        </header>
        <div className="volunteers-detail-wrapper">
          <div className="volunteer-operations">
            <div id='searchTemplate' className='search-wrapper portal-volunteer-search'>
              <div className="e-input-group" role="search">
                <input id="schedule_searchbar" className="e-input" name="input" type="search" placeholder="Cherche bénévole"  />
                <span className="e-clear-icon" aria-label="close" role="button" ></span>
                <span id="schedule_searchbutton" className="e-input-group-icon search-icon e-icons" tabIndex={-1} title="Search" aria-label="search"></span>
              </div>
            </div>
          </div>
          <div className="patient-display">
            <GridComponent ref={gridObj} dataSource={volunteerList} editSettings={{
              allowEditing: true, allowAdding: true,
              allowDeleting: true, mode: 'Dialog', template: dialogTemplate
            }} >
              <ColumnsDirective>
                <ColumnDirective field='Id' width='50' headerText='ID' textAlign='Left' isPrimaryKey={true}></ColumnDirective>
                <ColumnDirective field='Name' width='100' textAlign='Left' />
                <ColumnDirective field='Email' width='150' textAlign='Left' clipMode='EllipsisWithTooltip'></ColumnDirective>
                <ColumnDirective field='isAvailable' headerText='Disponible' width='100' textAlign='Left'></ColumnDirective>
              </ColumnsDirective>
            </GridComponent>
          </div>
        </div>
      </div>
      </>
    )
}