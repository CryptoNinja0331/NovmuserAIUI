import React from 'react';
const initValue = {
	currentTopicId: '',
	currentPointerId: '',
	updateCurrentId: (topicId: string, pointerId: string) => { }
}
const ChapterContext = React.createContext(initValue)

const ChapterProvider = ({ children }: React.PropsWithChildren) => {
	const [currentTopicId, updateCurrentTopicId] = React.useState('')
	const [currentPointerId, updateCurrentPointerId] = React.useState('')
	const updateCurrentId = (topicId: string, pointerId: string) => {
		console.log(topicId, pointerId)
		updateCurrentPointerId(pointerId)
		updateCurrentTopicId(topicId)
	}
	return (
		<ChapterContext.Provider
			value={{
				currentPointerId,
				currentTopicId,
				updateCurrentId
			}}
		>
			{children}
		</ChapterContext.Provider>
	)
}
export {
	ChapterContext,
	ChapterProvider
}
