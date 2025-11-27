-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE INDEX "accounts_providerId_accountId_idx" ON "accounts"("providerId", "accountId");

-- CreateIndex
CREATE INDEX "session_token_expiresAt_idx" ON "session"("token", "expiresAt");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "session_expiresAt_idx" ON "session"("expiresAt");

-- CreateIndex
CREATE INDEX "urls_userId_idx" ON "urls"("userId");

-- CreateIndex
CREATE INDEX "urls_status_idx" ON "urls"("status");

-- CreateIndex
CREATE INDEX "urls_userId_status_idx" ON "urls"("userId", "status");

-- CreateIndex
CREATE INDEX "urls_userId_createdAt_idx" ON "urls"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "verifications_identifier_value_idx" ON "verifications"("identifier", "value");

-- CreateIndex
CREATE INDEX "verifications_expiresAt_idx" ON "verifications"("expiresAt");
