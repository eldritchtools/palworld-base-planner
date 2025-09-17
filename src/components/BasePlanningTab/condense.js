import { Icon } from "../../Icon";

const condenseCounts = [4, 16, 32, 64];

function getCondenseCounts(start, end) {
    let count = 0;
    for (let i = start; i < end; i++) count += condenseCounts[i];
    return count;
}

function CondenseIcon({ level = null, size = null }) {
    if (level === null) return;

    return <Icon path={`T_icon_buildup_item_0${level}`} name={""} size={size} />
}

export { getCondenseCounts, CondenseIcon };