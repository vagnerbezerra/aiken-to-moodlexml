/* eslint-disable */
const moodleString = (questions, options = {}) => { console.log(options);
	return `<?xml version="1.0" encoding="UTF-8"?>
<quiz>
${questions.map((q,i)=>{
	return question(i, q, options.shuffle);
}).join("\n")}
</quiz>`};

const category = (category) => {
	return `	<question type="category">
		<category>
			<text>${category}</text>
		</category>
	</question>
`;
}

const categoryHierarchy = (categories) => {
	const defCats = ["$course$/top"].concat(categories);
	return defCats.map((c,i)=>category(defCats.slice(0,i+1).join("/"))).join("");
}

const question = (index, {type, name, question, categories, answers, correctAnswer, fractions, useLetters, feedback, single, tags}, shuffle) => { 
	if (type === "category"){
		return categoryHierarchy(categories);
	}
	return `	<!-- Question entry ${index} -->
	<question type="${type}">
		<name>
			<text><![CDATA[${(name) ? name : ''}]]></text>
		</name>
		<questiontext format="html">
			<text><![CDATA[${question}]]></text>
		</questiontext>
		${questionType(type, question, answers, correctAnswer, fractions, useLetters, feedback, single, shuffle)}${feedback ? `\n\t\t<generalfeedback><text>${feedback}</text></generalfeedback>` : ``}
		${showTags(tags)}
	</question>
`.replace('\n\t*\n', '');
}

const questionType = (type, question, answers, correctAnswer, fractions, useLetters, feedback, single, shuffle) => {
	if (type === 'matching' || type === "order"){
		return `${(answers || []).map((a,i) => {
			return `<subquestion>
			<text><![CDATA[${a}]]></text>
			${correctAnswer && correctAnswer.length ? (`<answer format="html">
				<text><![CDATA[${correctAnswer[i]}]]></text>
			</answer>
				`) : '\n'}
			</subquestion>
			${shuffle ? "<shuffleanswers>true</shuffleanswers>":""}
			`
	    }).join("")}`;
    } else if (type === 'truefalse') {
		return `${(answers||[]).map((a,i) => {
			const fraction = (correctAnswer || []).indexOf(i) === -1 ? "0" : "100";
				return `<answer format="moodle_auto_format" fraction="${(fractions && fractions[i] !== undefined) ? fractions[i] : fraction}">
				<text>${(a).toLowerCase()}</text>
		</answer>
		`;
	    }).join("")}${single ?  `\n\t\t<single>true</single>` : ''}${useLetters === false ? `\n\t\t<answernumbering>123</answernumbering>` : ''}`;
	} else {
		return `${(answers||[]).map((a,i) => {
			const fraction = (correctAnswer || []).indexOf(i) === -1 ? "0" : "100";
				return `<answer format="html" fraction="${(fractions && fractions[i] !== undefined) ? fractions[i] : fraction}">
				<text><![CDATA[${a}]]></text>
		</answer>
		`;
	    }).join("")}${single ?  `\n\t\t<single>true</single>` : (answers && answers.length > 1 ? `\n\t\t<single>false</single>` : '')}${useLetters === false ? `\n\t\t<answernumbering>123</answernumbering>` : ''}${shuffle ? `\n\t\t<shuffleanswers>true</shuffleanswers>` : ''}`;
	}
	
};

const showTags = tags => {
    if(tags && tags.length > 0){
        let result = `<tags>\n`;
        result += tags.map(tag => {
            return `        <tag>\n            <text>${tag}</text>\n        </tag>`;
        }).join('\n');
        result +=  `\n    </tags>`;
        return result;
    }
    return '';
};
export default moodleString;