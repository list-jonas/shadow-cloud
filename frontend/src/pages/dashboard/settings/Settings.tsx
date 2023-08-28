import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { useSettingsContext } from "../../../hooks/SettingsHook";
import themes, { IThemeGroup, getTheme } from "../../../data/themeData";
import Content from "../../../components/layout/Content/Content";
import { InputSwitch } from "primereact/inputswitch";

const Settings = () => {
  const { settings, updateSettings } = useSettingsContext();

  const groupedItemTemplate = (option: IThemeGroup) => {
    return (
      <div className="flex align-items-center" style={{userSelect: "none"}}>
        <span className="material-symbols-outlined mr-2">
          {`${option.type}_mode`}
        </span>
        <div>{option.type} Themes</div>
      </div>
    );
  }


  return (
    <Content title="Settings" className='settings'>
      <Card title={`Design`} className='mt-4'>
        <div className="grid m-3">
          <div className="col-4">
            <label htmlFor="select-style">Page Design:</label>
          </div>
          <div className="col">
            <Dropdown id="select-style" value={getTheme(settings.theme)?.name} onChange={(e) => updateSettings({theme: e.value})} 
                      options={themes} optionLabel="name" optionValue="name" 
                      optionGroupLabel="type" optionGroupChildren="themes" optionGroupTemplate={groupedItemTemplate}
                      placeholder="Select a Style" className="w-full md:w-14rem" />
          </div>
        </div>
      </Card>
      <Card title={`Units`} className='mt-4'>
        <div className="grid m-3">
          <div className="col-4">
            <label htmlFor="select-style">SI Units:</label>
          </div>
          <div className="col">
            <InputSwitch checked={settings.si} onChange={(e) => updateSettings({si: e.value!})} />
          </div>
        </div>
      </Card>
    </Content>
  );
};

export default Settings;