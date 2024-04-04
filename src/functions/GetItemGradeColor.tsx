






const GetItemGradeColor = (itemGrade: string) => {

    switch (itemGrade) {
        case 'common':
            return '#FFFFFF';
        case 'uncommon':
            return '#1EFF0C';
        case 'rare':
            return '#0070FF';
        case 'epic':
            return '#A335EE';
        case 'legendary':
            return '#FF8000';
    }

}

export default GetItemGradeColor;