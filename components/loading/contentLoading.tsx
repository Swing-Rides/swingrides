import { Spinner } from '../ui/spinner'

export default function ContentLoading() {
        return (
                <div className='grid place-content-center size-full'>
                        <div className='flex gap-2 justify-center items-center'>
                                <Spinner className="size-6" />
                                <span className='text-2xl font-semibold'>
                                        Loading...
                                </span>
                        </div>
                </div>
        )
}
