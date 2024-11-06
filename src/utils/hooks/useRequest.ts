import { AxiosError } from 'axios';
import { useCallback, useState, useEffect, Dispatch } from 'react';

export default function useRequest<T, S = any>(
    request: (params?: S) => Promise<T>,
    initialParams?: S,
    instate: boolean = true
): [T | undefined, boolean, string | null, () => void, Dispatch<React.SetStateAction<S | undefined>>] {
    const [data, setData] = useState<T>();
    const [reqParams, setReqParams] = useState<S | undefined>(initialParams);
    const [isLoading, setIsLoading] = useState<boolean>(instate);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await request(reqParams);
            setData(response);
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.response?.data.message || err.message);
            } else {
                setError(`${err}`);
            }
        } finally {
            setIsLoading(false);
        }
    }, [request, reqParams]);

    useEffect(() => {
        if (instate || reqParams !== undefined) {
            execute();
        }
    }, [execute, instate, reqParams]);

    return [data, isLoading, error, execute, setReqParams];
}