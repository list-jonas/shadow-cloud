import fileIcons from "./fileIcons";

export function chooseFileIcon(fileName: string): string {
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    if (!fileExtension) return `${fileIcons.defaultIcon.name}.svg`;

    // Sort by longest name first
    const sortedIcons = fileIcons.icons.sort((a, b) => b.name.length - a.name.length);

    const iconName = sortedIcons.find(icon => {
        return (icon.fileNames?.includes(fileName) 
            || icon.fileExtensions?.includes(fileExtension) 
            || fileName.includes(icon.name));
    })?.name;

    return iconName ? `${iconName}.svg` : `${fileIcons.defaultIcon.name}.svg`;
}

export default chooseFileIcon;