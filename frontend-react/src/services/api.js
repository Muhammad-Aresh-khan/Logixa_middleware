const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

class ApiService {
    async request(endpoint, method = 'GET', data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || `API Error: ${response.status} ${response.statusText}`);
                }
                return result;
            } else {
                const text = await response.text();
                throw new Error(`API Error: ${response.status} ${response.statusText}. Response: ${text.substring(0, 100)}...`);
            }
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async login(orgname, email, password) {
        return this.request('/login', 'POST', { orgname, email, password });
    }

    async createAccount(orgname, email, password) {
        return this.request('/create_account', 'POST', { orgname, email, password });
    }

    async getLicenseDetails(orgname) {
        return this.request(`/get_license_details?orgname=${encodeURIComponent(orgname)}`);
    }

    async mapUser(license_key, orgname, email) {
        return this.request('/map_user', 'POST', { license_key, orgname, email });
    }

    async getAvailableLicenses() {
        return this.request('/get_available_licenses');
    }
}

export default new ApiService();
